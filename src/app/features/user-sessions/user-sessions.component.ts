import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Session, SessionService } from '../../core/services/session.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-sessions',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-sessions.component.html',
  styleUrls: ['./user-sessions.component.css']
})
export class UserSessionsComponent implements OnInit {
  sessions: Session[] = [];
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = params['id'];
      if (userId) {
        this.loadSessions(userId);
      } else {
        this.error = 'No user ID provided';
        this.loading = false;
      }
    });
  }

  loadSessions(userId: number): void {
    this.sessionService.getSessionsByUser(userId).subscribe({
      next: (response: any) => {
        this.sessions = response.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load sessions';
        this.loading = false;
      }
    });
  }
}
