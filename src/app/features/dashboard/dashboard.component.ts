import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { AuthenticatedUser } from '../../shared/models/auth.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loading" class="loading-screen">
      <div style="display:flex">
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
      </div>
    </div>

    <div *ngIf="!loading && currentUser" class="dashboard-layout">
      <main class="dashboard-content">
        <!-- Welcome Banner -->
        <div class="welcome-banner">
          <div class="welcome-title">Welcome back, {{ currentUser.user.firstName }}! 👋</div>
          <p class="welcome-sub">Here's an overview of your account.</p>
        </div>

        <!-- Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ currentUser.user.roles?.length || 0 }}</div>
            <div class="stat-label">Assigned roles</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ currentUser.user.permissions?.length || 0 }}</div>
            <div class="stat-label">Permissions</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ currentUser.user.status === 0 ? 'Active' : 'Inactive' }}</div>
            <div class="stat-label">Account status</div>
          </div>
        </div>

        <!-- Info cards -->
        <div class="info-grid">
          <div class="info-card">
            <div class="info-card-title">Profile Information</div>
            <div class="info-row">
              <span class="info-key">Email</span>
              <span class="info-val">{{ currentUser.user.email }}</span>
            </div>
            <div class="info-row">
              <span class="info-key">First name</span>
              <span class="info-val">{{ currentUser.user.firstName }}</span>
            </div>
            <div class="info-row">
              <span class="info-key">Last name</span>
              <span class="info-val">{{ currentUser.user.lastName }}</span>
            </div>
            <div class="info-row">
              <span class="info-key">Phone</span>
              <span class="info-val">{{ currentUser.user.phoneNumber }}</span>
            </div>
          </div>

          <div class="info-card">
            <div class="info-card-title">Roles & Permissions</div>
            <div class="info-row" style="flex-direction:column;align-items:flex-start;gap:8px">
              <span class="info-key">Roles</span>
              <div>
                <span *ngFor="let role of currentUser.user.roles" class="badge badge-role">{{ role }}</span>
              </div>
            </div>
            <div class="info-row" style="flex-direction:column;align-items:flex-start;gap:8px;margin-top:12px">
              <span class="info-key">Permissions</span>
              <div>
                <span *ngFor="let perm of currentUser.user.permissions" class="badge badge-perm">{{ perm }}</span>
                <span *ngIf="!currentUser.user.permissions?.length" style="font-size:0.85rem;color:#6b7c72">None assigned</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  loading = true;
  currentUser: AuthenticatedUser | null = null;
  private userSubscription: Subscription | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
  }
}
