import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { TutorService } from '../../core/services/tutor.service';
import { UserProfile } from '../../shared/models/auth.models';
import {Tutor} from "../../shared/models/tutor.model";

interface CombinedProfile extends UserProfile {
  tutorDetails?: Tutor;
  profilePictureUrl?: string; // Added for profile picture
  coverPhotoUrl?: string; // Added for cover photo
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
  selectedFile: File | null = null;

  constructor(
    private authService: AuthService,
    private tutorService: TutorService
  ) {}

  ngOnInit(): void {
    this.profile$ = this.authService.getProfile().pipe(
      switchMap(apiResponse => {
        const userProfile = apiResponse.data;
        const combinedProfile: CombinedProfile = { ...userProfile };

        // Mock profile picture for now
        combinedProfile.profilePictureUrl = `data:image/jpeg;base64,${userProfile.image}` ;
        combinedProfile.coverPhotoUrl = 'assets/default-cover.jpg';

        console.log(userProfile.image)
        if (userProfile.roles.includes('TUTOR')) {
          // Assuming you have a method to get tutor details by user ID
          // If not, this will need to be implemented in TutorService
          return this.tutorService.getTutorByUserId(userProfile.id).pipe(
            switchMap(tutorDetails => {
              combinedProfile.tutorDetails = tutorDetails;
              return of(combinedProfile);
            })
          );
        }
        return of(combinedProfile);
      })
    );
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Here you would typically call a service to upload the file
      console.log('File selected:', file.name);

      // For demonstration, read the file and update the profile picture URL locally
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Update the profile observable with the new image URL
        this.profile$ = this.profile$.pipe(
          switchMap(profile => {
            if (profile) {
              return of({ ...profile, profilePictureUrl: e.target.result });
            }
            return of(null);
          })
        );
      };
      reader.readAsDataURL(file);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
