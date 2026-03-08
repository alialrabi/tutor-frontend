import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tutor-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './tutor-home.component.html',
  styleUrls: ['./tutor-home.component.css']
})
export class TutorHomeComponent implements OnInit {
  tutorId: number | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.tutorId = this.authService.getTutorIdFromToken();
  }
}
