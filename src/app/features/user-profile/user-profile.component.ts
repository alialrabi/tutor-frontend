import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { TutorService } from '../../core/services/tutor.service';
import { UserProfile } from '../../shared/models/auth.models';
import { Tutor } from '../../shared/models/tutor.model';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import {map, Observable, of, switchMap} from "rxjs";


export interface ProfileViewModel {
    profile: UserProfile;
    tutorDetails: Tutor | null;
}

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatListModule, MatDividerModule, MatButtonModule, MatIconModule],
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
    vm$!: Observable<ProfileViewModel>;

    editForm!: FormGroup;
    showEditModal = false;
    loading = false;
    selectedFile: File | null = null;

    showShareMenu = false;
    copied = false;

    profilePictureUrl: string | null = null;
    tutorDetails?: Tutor;

    // Star rating state
    selectedRating = 0;
    hoveredStar = 0;
    ratingSubmitted = false;
    ratingLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

    profileUrl = window.location.href;
    shareText = 'Check out my profile!';

    constructor(
        private authService: AuthService,
        private tutorService: TutorService,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.loadProfile();
    }

    openShareMenu() { this.showShareMenu = true; }
    closeShareMenu() { this.showShareMenu = false; }

    shareVia(platform: string): void {
        const encodedUrl = encodeURIComponent(this.profileUrl);
        const encodedText = encodeURIComponent(this.shareText);

        const urls: Record<string, string> = {
            whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            twitter:  `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
            email:    `mailto:?subject=${encodedText}&body=${encodedUrl}`,
        };

        if (platform === 'copy') {
            navigator.clipboard.writeText(this.profileUrl).then(() => {
                this.copied = true;
                setTimeout(() => (this.copied = false), 2500);
            });
        } else {
            window.open(urls[platform], '_blank');
        }

        if (platform !== 'copy') this.closeShareMenu();
    }

    loadProfile() {
        this.vm$ = this.authService.getProfile().pipe(
            switchMap((res) => {
                const profile = res.data as UserProfile;

                if (profile?.userType === 'TUTOR') {
                    // fetch tutor details and wait for both before emitting
                    return this.tutorService.getTutorByUserId(profile.id).pipe(
                        map((tutorRes) => ({
                            profile,
                            tutorDetails: tutorRes.data as Tutor
                        }))
                    );
                }

                // non-tutor: emit immediately
                return of({ profile, tutorDetails: null });
            })
        );
    }



    // Star rating methods
    selectRating(star: number): void {
        this.selectedRating = star;
    }

    submitRating(tutorId: number | undefined): void {
        if (this.selectedRating === 0 || this.ratingSubmitted) return;

        this.tutorService.updateRating(tutorId, this.selectedRating).subscribe({
            next: () => { this.ratingSubmitted = true; },
            error: (err) => console.error('Rating failed', err)
        });
    }

    onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.profilePictureUrl = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    openEditModal(vm: ProfileViewModel): void {
        this.editForm = this.fb.group({
            firstName: [vm.profile.firstName, Validators.required],
            lastName: [vm.profile.lastName, Validators.required],
            phoneNumber: [vm.profile.phoneNumber, Validators.required],
            bio: [vm.tutorDetails?.bio || ''],
            hourlyRate: [vm.tutorDetails?.hourlyRate || 0],
            experienceYears: [vm.tutorDetails?.experienceYears || 0]
        });
        this.showEditModal = true;
    }

    updateTutor(vm: ProfileViewModel) {
        this.tutorService.updateTutor(vm.tutorDetails?.id, vm.tutorDetails).subscribe(
            () => {
                this.loadProfile();
                this.closeEditModal();
                console.log("........")
                },
            (err) => {
                console.log("88888")
            }
        )
    }

    closeEditModal(): void {
        this.showEditModal = false;
    }

    onSaveProfile(): void {
        if (this.editForm.valid) {
            this.loading = true;
            const updatedData = this.editForm.value;

            this.authService.updateProfile(updatedData).subscribe({
                next: () => {
                    this.loadProfile();
                    this.closeEditModal();
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Update failed', err);
                    this.loading = false;
                }
            });
        }
    }

    logout(): void {
        this.authService.logout();
    }
}