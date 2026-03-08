import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Session, SessionService } from '../../core/services/session.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tutor-sessions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tutor-sessions.component.html',
  styleUrls: ['./tutor-sessions.component.css']
})
export class TutorSessionsComponent implements OnInit {
  sessions: Session[] = [];
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
    debugger
    this.route.params.subscribe(params => {
      const tutorId = params['id'];
      if (tutorId) {
        this.loadSessions(tutorId);
      } else {
        this.error = 'No tutor ID provided';
        this.loading = false;
      }
    });
  }

  loadSessions(tutorId: number): void {
    this.sessionService.getSessionsByTutor(tutorId).subscribe({
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
