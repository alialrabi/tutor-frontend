import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TutorService } from '../../core/services/tutor.service';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../../shared/pipes/safe-url.pipe';
import {Tutor} from "../../shared/models/tutor.model";

@Component({
  selector: 'app-tutor-details',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe, RouterLink],
  templateUrl: './tutor-details.component.html',
  styleUrl: './tutor-details.component.css'
})
export class TutorDetailsComponent implements OnInit {
  tutor: Tutor | null = null;
  youtubeLink: string | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private tutorService: TutorService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.getTutorDetails(id);
      } else {
        this.error = 'No tutor ID provided';
        this.loading = false;
      }
    });
  }

  getTutorDetails(id: number): void {
    this.tutorService.getTutorDetails(id).subscribe({
      next: (response: any) => {
        this.tutor = response.data;
        if (this.tutor && this.tutor.videoId) {
          this.youtubeLink = `https://www.youtube.com/embed/${this.tutor.videoId}`;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching tutor details:', err);
        this.error = 'Failed to load tutor details';
        this.loading = false;
      }
    });
  }
}
