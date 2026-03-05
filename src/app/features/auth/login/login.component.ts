import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-layout">
      <div class="auth-panel">
        <div class="panel-logo">Tutor<span>.</span></div>
        <div class="panel-headline">Connect with expert tutors</div>
        <p class="panel-sub">Learn anything, anywhere. Join thousands of students and tutors already on our platform.</p>
        <div class="panel-features">
          <div class="panel-feature"><div class="panel-feature-dot"></div> Find verified expert tutors</div>
          <div class="panel-feature"><div class="panel-feature-dot"></div> Book 1-on-1 or group sessions</div>
          <div class="panel-feature"><div class="panel-feature-dot"></div> Secure & flexible payments</div>
        </div>
      </div>

      <div class="auth-form-side">
        <div class="auth-card">
          <div class="auth-card-title">Welcome back</div>
          <p class="auth-card-sub">Sign in to your account to continue</p>

          <div *ngIf="error" class="alert alert-error">{{ error }}</div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="field">
              <label for="email">Email address</label>
              <input id="email" type="email" formControlName="email" placeholder="you@example.com" autocomplete="email">
              <span *ngIf="f['email'].invalid && f['email'].touched" class="field-error">Please enter a valid email</span>
            </div>

            <div class="field">
              <label for="password">Password</label>
              <input id="password" type="password" formControlName="password" placeholder="••••••••" autocomplete="current-password">
              <span *ngIf="f['password'].invalid && f['password'].touched" class="field-error">Password is required</span>
            </div>

            <button type="submit" class="btn btn-primary" [disabled]="loading || form.invalid">
              <span *ngIf="loading" class="spinner"></span>
              {{ loading ? 'Signing in…' : 'Sign in' }}
            </button>
          </form>

          <p class="auth-switch">Don't have an account? <a routerLink="/auth/register">Create one</a></p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    this.authService.login(this.form.value).subscribe({
      next: () => {
         console.log(this.authService.getToken());
        this.loading = false;
        this.router.navigate(['/dashboard'])
      },
      error: (err) => {
        this.error = err.error?.message || 'Invalid email or password';
        this.loading = false;
      }
    });
  }
}
