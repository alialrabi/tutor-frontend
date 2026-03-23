import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { CategoryService, CategoryTutorsDto } from '../../core/services/category.service';
import { FilterRequest } from '../../core/services/search.service';
import { AuthenticatedUser } from '../../shared/models/auth.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  loading = true;
  currentUser: AuthenticatedUser | null = null;
  categories: CategoryTutorsDto[] = [];
  private userSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.loading = false;
    });

    this.loadCategories();
  }

  loadCategories(): void {
    const request: FilterRequest = {
      filterList: [],
      sortCriteria: [],
      page: 0,
      size: 10 // Adjust size as needed
    };

    this.categoryService.getCategories(request).subscribe({
      next: (data: any) => {

        this.categories = data;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
  }
}
