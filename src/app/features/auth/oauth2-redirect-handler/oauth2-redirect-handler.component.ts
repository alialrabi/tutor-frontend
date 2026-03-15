import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-oauth2-redirect-handler',
  standalone: true,
  template: `<div class="loading-screen">
    <div class="loading-dot"></div>
    <div class="loading-dot"></div>
    <div class="loading-dot"></div>
  </div>`
})
export class OAuth2RedirectHandlerComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const error = this.route.snapshot.queryParamMap.get('error');

    if (token) {
      this.authService.handleOAuth2Login(token).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('OAuth2 login failed:', err);
          this.router.navigate(['/auth/login'], { queryParams: { error: 'OAuth2 login failed' } });
        }
      });
    } else if (error) {
      console.error('OAuth2 error:', error);
      this.router.navigate(['/auth/login'], { queryParams: { error } });
    } else {
      // Fallback if no token or error is present
      this.router.navigate(['/auth/login'], { queryParams: { error: 'Invalid OAuth2 redirect' } });
    }
  }
}
