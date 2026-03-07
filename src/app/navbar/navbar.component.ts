import {Component, OnInit} from '@angular/core';
import {AuthResponse, UserProfile} from "../shared/models/auth.models";
import {AuthService} from "../core/services/auth.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  loading = true;
  currentUser: AuthResponse | null = null;
  profile: UserProfile | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => this.currentUser = user);
    this.authService.getProfile().subscribe({
      next: res => {
        this.profile = res.data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  get initials(): string {
    const u = this.currentUser;
    return u ? `${u.firstName[0]}${u.lastName[0]}`.toUpperCase() : '?';
  }

  get primaryRole(): string {
    return this.currentUser?.roles?.[0] ?? 'User';
  }

  logout(): void {
    this.authService.logout();
  }

}
