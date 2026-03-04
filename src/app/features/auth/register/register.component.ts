import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-layout">
      <div class="auth-panel">
        <div class="panel-logo">Tutor<span>.</span></div>
        <div class="panel-headline">Start your learning journey today</div>
        <p class="panel-sub">Join as a student to find your perfect tutor, or as a tutor to share your expertise.</p>
        <div class="panel-features">
          <div class="panel-feature"><div class="panel-feature-dot"></div> Free to create an account</div>
          <div class="panel-feature"><div class="panel-feature-dot"></div> Hundreds of subjects available</div>
          <div class="panel-feature"><div class="panel-feature-dot"></div> Trusted by 10,000+ learners</div>
        </div>
      </div>

      <div class="auth-form-side">
        <div class="auth-card">
          <div class="auth-card-title">Create account</div>
          <p class="auth-card-sub">Fill in your details to get started</p>

          <div *ngIf="error" class="alert alert-error">{{ error }}</div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <!-- Role picker -->
            <div class="field">
              <label>I am a</label>
              <div class="role-selector">
                <div class="role-card" [class.active]="form.value.role === 'STUDENT'" (click)="setRole('STUDENT')">
                  <div class="role-card-icon">🎓</div>
                  <div class="role-card-label">Student</div>
                </div>
                <div class="role-card" [class.active]="form.value.role === 'TUTOR'" (click)="setRole('TUTOR')">
                  <div class="role-card-icon">📚</div>
                  <div class="role-card-label">Tutor</div>
                </div>
              </div>
            </div>

            <div class="field-row">
              <div class="field">
                <label for="firstName">First name</label>
                <input id="firstName" type="text" formControlName="firstName" placeholder="John">
                <span *ngIf="f['firstName'].invalid && f['firstName'].touched" class="field-error">Required</span>
              </div>
              <div class="field">
                <label for="lastName">Last name</label>
                <input id="lastName" type="text" formControlName="lastName" placeholder="Doe">
                <span *ngIf="f['lastName'].invalid && f['lastName'].touched" class="field-error">Required</span>
              </div>
            </div>

            <div class="field">
              <label for="email">Email address</label>
              <input id="email" type="email" formControlName="email" placeholder="you@example.com" autocomplete="email">
              <span *ngIf="f['email'].invalid && f['email'].touched" class="field-error">Valid email required</span>
            </div>

            <div class="field">
              <label for="phoneNumber">Phone number</label>
              <input id="phoneNumber" type="tel" formControlName="phoneNumber" placeholder="+1 234 567 8900">
              <span *ngIf="f['phoneNumber'].invalid && f['phoneNumber'].touched" class="field-error">Required</span>
            </div>

            <div class="field">
              <label for="password">Password</label>
              <input id="password" type="password" formControlName="password" placeholder="Min 6 characters" autocomplete="new-password">
              <span *ngIf="f['password'].invalid && f['password'].touched" class="field-error">Min 6 characters</span>
            </div>

            <button type="submit" class="btn btn-primary" [disabled]="loading || form.invalid">
              <span *ngIf="loading" class="spinner"></span>
              {{ loading ? 'Creating account…' : 'Create account' }}
            </button>
          </form>

          <p class="auth-switch">Already have an account? <a routerLink="/auth/login">Sign in</a></p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      firstName:   ['', Validators.required],
      lastName:    ['', Validators.required],
      email:       ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password:    ['', [Validators.required, Validators.minLength(6)]],
      role:        ['STUDENT']
    });
  }

  get f() { return this.form.controls; }

  setRole(role: string): void {
    this.form.patchValue({ role });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    this.authService.register(this.form.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error = err.error?.message || 'Registration failed. Try again.';
        this.loading = false;
      }
    });
  }
}
