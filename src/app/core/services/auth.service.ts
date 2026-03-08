import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, switchMap, map, of } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { 
  ApiResponse, 
  LoginRequest, 
  RegisterRequest, 
  UserProfile, 
  LoginResponseData, 
  AuthenticatedUser 
} from '../../shared/models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly URL = 'http://localhost:8088';
  private readonly API = '/api/auth';
  private readonly TOKEN_KEY = 'tutor_token';
  private readonly USER_KEY = 'tutor_user';

  private currentUserSubject: BehaviorSubject<AuthenticatedUser | null>;
  currentUser$: Observable<AuthenticatedUser | null>;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.currentUserSubject = new BehaviorSubject<AuthenticatedUser | null>(this.getStoredUser());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  register(data: RegisterRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.URL}${this.API}/register`, data);
  }

  login(data: LoginRequest): Observable<AuthenticatedUser> {
    return this.http.post<ApiResponse<LoginResponseData>>(`${this.URL}${this.API}/login`, data).pipe(
      switchMap(response => {
        if (response.responseStatus === 'SUCCESS' || response.responseStatus === '0') { // Check for success status
          const token = response.data.token;
          
          // Store token temporarily to make the next request
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.TOKEN_KEY, token);
          }

          // Fetch user profile
          return this.getProfile().pipe(
            map(profileResponse => {
              const user = profileResponse.data;
              const authUser: AuthenticatedUser = { token, user };
              this.storeAuth(authUser);
              return authUser;
            })
          );
        } else {
          throw new Error(response.traceError || 'Login failed');
        }
      })
    );
  }

  getProfile(): Observable<ApiResponse<UserProfile>> {
    // Manually add the token header since the interceptor might not pick it up yet if it relies on the subject
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
    return this.http.post(`${this.URL}${this.API}/upload-photo`, formData);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
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

  hasRole(role: string): boolean {
    return this.currentUserSubject.value?.user.roles?.includes(role) ?? false;
  }

  hasPermission(permission: string): boolean {
    return this.currentUserSubject.value?.user.permissions?.includes(permission) ?? false;
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
