import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, UserProfile } from '../../shared/models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly URL = 'http://localhost:8088';
  private readonly API = '/api/auth';
  private readonly TOKEN_KEY = 'tutor_token';
  private readonly USER_KEY = 'tutor_user';

  private currentUserSubject: BehaviorSubject<AuthResponse | null>;
  currentUser$: Observable<AuthResponse | null>;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.getStoredUser());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  register(data: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.URL}${this.API}/register`, data).pipe(
      tap(res => { if (res.success) this.storeAuth(res.data); })
    );
  }

  login(data: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    debugger
    return this.http.post<ApiResponse<AuthResponse>>(`${this.URL}${this.API}/login`, data).pipe(
      tap(res => {
      //  if (res.success) {
        console.log(res)
          this.storeAuth(res.data);
       // }
      })
    );
  }

  getProfile(): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.URL}${this.API}/me`);
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
    return this.currentUserSubject.value?.roles?.includes(role) ?? false;
  }

  hasPermission(permission: string): boolean {
    return this.currentUserSubject.value?.permissions?.includes(permission) ?? false;
  }

  private storeAuth(auth: AuthResponse): void {
    debugger
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, auth.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(auth));
    }
    this.currentUserSubject.next(auth);
  }

  private getStoredUser(): AuthResponse | null {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.USER_KEY);
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  }
}
