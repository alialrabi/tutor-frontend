import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { AuthenticatedUser } from '../shared/models/auth.models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: AuthenticatedUser | null = null;
  private userSubscription: Subscription | undefined;
  tutorId: number | null = null;
  userId: number | null = null;
  currentLang = 'en'; // Default language is English
  showLangDropdown = false;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      debugger
      this.tutorId = this.authService.getTutorIdFromToken();
      this.userId = this.authService.getUserIdFromToken();
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
  }

  toggleLangDropdown(): void {
    this.showLangDropdown = !this.showLangDropdown;
  }

  changeLanguage(lang: string): void {
    this.currentLang = lang;
    this.showLangDropdown = false;
    // Here you would typically call a translation service to switch languages
    console.log('Language changed to:', lang);
  }
}
