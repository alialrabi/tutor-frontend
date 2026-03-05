import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, UserProfile } from '../../shared/models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly URL = 'http://localhost:8088';
  private readonly API = '/api/auth';
  private readonly TOKEN_KEY = 'tutor_token';
  private readonly USER_KEY = 'tutor_user';

  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  register(data: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.URL}${this.API}/register`, data).pipe(
      tap(res => { if (res.success) this.storeAuth(res.data); })
    );
  }

  login(data: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.URL}${this.API}/login`, data).pipe(
      tap(res => {
        console.log(res.success);
        if (res.success) {
          console.log("22222222222222222222222222222");

          this.storeAuth(res.data);
        }
      })
    );
  }

  getProfile(): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.URL}${this.API}/me`);
  }

  logout(): void {
    const storage = this.getStorage();
    storage?.removeItem(this.TOKEN_KEY);
    storage?.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    const storage = this.getStorage();
    console.log(storage?.getItem(this.TOKEN_KEY))
    return storage? storage.getItem(this.TOKEN_KEY) : null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    console.log("token:", token);
    return !!token;
  }

  hasRole(role: string): boolean {
    return this.currentUserSubject.value?.roles?.includes(role) ?? false;
  }

  hasPermission(permission: string): boolean {
    return this.currentUserSubject.value?.permissions?.includes(permission) ?? false;
  }

  private storeAuth(auth: AuthResponse): void {
    const storage = this.getStorage();
    console.log(auth.token)
    storage?.setItem(this.TOKEN_KEY, auth.token);
    storage?.setItem(this.USER_KEY, JSON.stringify(auth));
    this.currentUserSubject.next(auth);
  }

  private getStorage(): Storage | null {
    try {

      if (typeof window !== 'undefined') {
        console.log("33333333333333333333333333")
        return localStorage;
      }
      console.log("888888888888888")
      return null;
    } catch {
      return null;
    }
  }

  private getStoredUser(): AuthResponse | null {
    const storage = this.getStorage();
    const stored = storage ? storage.getItem(this.USER_KEY) : null;
    return stored ? JSON.parse(stored) : null;
  }
}
