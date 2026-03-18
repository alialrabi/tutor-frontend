import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { AuthenticatedUser } from '../shared/models/auth.models';
import {email} from "@angular/forms/signals";

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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.tutorId = this.currentUser?.user.tutorId ? this.currentUser?.user.tutorId : null;
      console.log("****", this.tutorId);
      this.userId = this.authService.getUserIdFromToken();
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
  }

  protected readonly email = email;
}
