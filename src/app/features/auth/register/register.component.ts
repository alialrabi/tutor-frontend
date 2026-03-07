import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
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

    const { role, email } = this.form.value;

    this.authService.register(this.form.value).subscribe({
      next: () => {
        if (role === 'TUTOR') {
          this.router.navigate(['/tutor/register'], { queryParams: { email } });
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Registration failed. Try again.';
        this.loading = false;
      }
    });
  }
}
