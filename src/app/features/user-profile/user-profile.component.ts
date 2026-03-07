import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { TutorService } from '../../core/services/tutor.service';
import { UserProfile } from '../../shared/models/auth.models';
import {Tutor} from "../../shared/models/tutor.model";

interface CombinedProfile extends UserProfile {
  tutorDetails?: Tutor;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  profile$: Observable<CombinedProfile | null> = of(null);

  constructor(
    private authService: AuthService,
    private tutorService: TutorService
  ) {}

  ngOnInit(): void {
    this.profile$ = this.authService.getProfile().pipe(
      switchMap(apiResponse => {
        const userProfile = apiResponse.data;
        if (userProfile.roles.includes('TUTOR')) {
          // Assuming you have a method to get tutor details by user ID
          // If not, this will need to be implemented in TutorService
          return this.tutorService.getTutorByUserId(userProfile.id).pipe(
            switchMap(tutorDetails => of({ ...userProfile, tutorDetails }))
          );
        }
        return of(userProfile);
      })
    );
  }

  logout(): void {
    this.authService.logout();
  }
}
