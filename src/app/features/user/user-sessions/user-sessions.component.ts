import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Session, SessionService } from '../../../core/services/session.service';
import { CommonModule } from '@angular/common';
import {ApiResponse} from "../../../shared/models/auth.models";

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
    private sessionService: SessionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = params['id'];
      console.log(userId)
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
      next: (response: ApiResponse<Session[]>) => {
        this.sessions = response.data;
        this.loading = false;
        console.log('>>>>>>>>>>>>>>', this.loading)
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = 'Failed to load sessions';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  joinCall(sessionId: number): void {
    this.router.navigate(['/video-stream'], { queryParams: { sessionId } });
  }

}
