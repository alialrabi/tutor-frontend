import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TutorService } from '../../../core/services/tutor.service';
import {UserProfile} from "../../../shared/models/auth.models";
import {AuthService} from "../../../core/services/auth.service";
import {switchMap, tap} from "rxjs";

@Component({
  selector: 'app-tutor-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tutor-registration.component.html',
  styleUrls: ['./tutor-registration.component.css']
})
export class TutorRegistrationComponent implements OnInit {
  tutorForm: FormGroup;
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private tutorService: TutorService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {
    this.tutorForm = this.fb.group({
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      bio: ['', Validators.required],
      hourlyRate: ['', [Validators.required, Validators.min(0)]],
      experienceYears: ['', [Validators.required, Validators.min(0)]],
      acceptsOneToOne: [true, Validators.required],
      acceptsOneToMany: [false, Validators.required],
      videoId: [''] // Optional
    });

  }

  currentUser?: UserProfile;

  ngOnInit(): void {
    this.authService.getProfile().subscribe(profile => {
      this.currentUser = profile.data;
      this.tutorForm.patchValue({
        email: this.currentUser.email
      });
      this.tutorForm.patchValue({
        userId:this.currentUser.id
      })
    })
  }

  onSubmit(): void {
    if (this.tutorForm.valid) {
      const formValue = this.tutorForm.getRawValue(); // Use getRawValue to include disabled fields
      
      // Construct the full Tutor object with default values
      const tutorData = {
        ...formValue,
        userId: this.currentUser?.id,
        rating: 0,
        totalReviews: 0,
        status: 0,
        numberOfSessions: 0
        // id and user will be handled by the backend
      };

      this.tutorService.registerTutor(tutorData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Registration failed', err);
        }
      });
    }
  }
}
