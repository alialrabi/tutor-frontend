import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, switchMap, map, of } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import {OAuthService, OAuthSuccessEvent} from 'angular-oauth2-oidc';
import {
  ApiResponse, 
  LoginRequest, 
  RegisterRequest, 
  UserProfile, 
  LoginResponseData, 
  AuthenticatedUser 
} from '../../shared/models/auth.models';
import {authConfig} from "../config/auth.config";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly URL = 'http://localhost:8088';
  private readonly API = '/api/auth';
  private readonly TOKEN_KEY = 'tutor_token';
  private readonly USER_KEY = 'tutor_user';
  private discoveryLoaded = false;

  private currentUserSubject: BehaviorSubject<AuthenticatedUser | null>;
  currentUser$: Observable<AuthenticatedUser | null>;


  constructor(
      private oauthService: OAuthService,
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.currentUserSubject = new BehaviorSubject<AuthenticatedUser | null>(this.getStoredUser());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }


  registerWithGoogle() {

  }

  register(data: RegisterRequest): Observable<AuthenticatedUser> {
    return this.http.post<ApiResponse<any>>(`${this.URL}${this.API}/register`, data).pipe(
      switchMap(() => {
        const loginData: LoginRequest = { email: data.email, password: data.password };
        return this.login(loginData);
      })
    );
  }

  login(data: LoginRequest): Observable<AuthenticatedUser> {
    return this.http.post<ApiResponse<LoginResponseData>>(`${this.URL}${this.API}/login`, data).pipe(
      switchMap(response => {
        console.log(response);
        return this.handleAuthResponse(response)
      })
    );
  }


  async initOAuth(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    this.oauthService.configure(authConfig);

    // ✅ This is where handleOAuth2Login gets called
    this.oauthService.events.subscribe((event: any) => {
      if (event instanceof OAuthSuccessEvent && event.type === 'token_received') {
        const googleIdToken = this.oauthService.getIdToken();
        if (googleIdToken) {
          this.handleOAuth2Login(googleIdToken).subscribe({
            next: () => this.router.navigate(['/dashboard'], { replaceUrl: true }),
            error: (err) => this.handleOAuthError(err)
          });
        }
      }
    });

    await this.oauthService.loadDiscoveryDocumentAndTryLogin();
    this.discoveryLoaded = true;
  }

  private handleOAuthError(err: any): void {
    // ✅ extract message from your GenericResponseEntity error shape
    const message =
        'Google login failed. Please try again.';

    // ✅ reset OAuth state so next attempt works fresh
    this.discoveryLoaded = false;
    this.oauthService.logOut(true);

    // ✅ redirect to login with error message as query param
    this.router.navigate(['/auth/login'], {
      replaceUrl: true,
      queryParams: { error: message }
    });
  }

  handleOAuth2Login(googleIdToken: string): Observable<AuthenticatedUser> {
    return this.http.post<ApiResponse<LoginResponseData>>(
        `${this.URL}${this.API}/google`,
        { idToken: googleIdToken }  // ✅ matches body.get("token")
    ).pipe(
        switchMap(response => {
          console.log(response);
          return this.handleAuthResponse(response)
        })
    );
  }

  async loginWithGoogle(): Promise<void> {
    if (!this.discoveryLoaded) {
      await this.initOAuth();
    }
    this.oauthService.initCodeFlow();
  }

  // Used for OAuth2 redirect flow

  private handleAuthResponse(response: ApiResponse<LoginResponseData>): Observable<AuthenticatedUser> {
    if (response.responseStatus === 'SUCCESS' || response.responseStatus === '0') {
      const token = response.data.token;
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.TOKEN_KEY, token);
      }
      return this.getProfile().pipe(
        map(profileResponse => {
          const user = profileResponse.data;
          const authUser: AuthenticatedUser = { token, user };
          this.storeAuth(authUser);
          return authUser;
        })
      );
    } else {
      throw new Error(response.traceError || 'Authentication failed');
    }
  }

  getProfile(): Observable<ApiResponse<UserProfile>> {
    const token = this.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.get<ApiResponse<UserProfile>>(`${this.URL}${this.API}/me`, { headers });
  }

  uploadProfilePicture(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', this.currentUserSubject.value?.user.email || '')
    return this.http.post(`${this.URL}${this.API}/upload-photo`, formData);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }

    this.oauthService.revokeTokenAndLogout();
    this.oauthService.logOut(true); // true = no redirect to Google logout page
    this.discoveryLoaded = false;   // ✅ force re-init on next login attempt

    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getTutorIdFromToken(): number | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.tutorId || null;
    } catch (e) {
      return null;
    }
  }

  getUserIdFromToken(): number | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || null;
    } catch (e) {
      return null;
    }
  }

  private storeAuth(auth: AuthenticatedUser): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, auth.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(auth));
    }
    this.currentUserSubject.next(auth);
  }

  private getStoredUser(): AuthenticatedUser | null {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.USER_KEY);
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  }
}
