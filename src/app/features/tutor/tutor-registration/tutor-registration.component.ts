import {ChangeDetectorRef, Component, DoCheck, NgZone, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TutorService } from '../../../core/services/tutor.service';
import {UserProfile} from "../../../shared/models/auth.models";
import {AuthService} from "../../../core/services/auth.service";
import {switchMap, tap} from "rxjs";
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";

@Component({
    selector: 'app-tutor-registration',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './tutor-registration.component.html',
    styleUrls: ['./tutor-registration.component.css']
})
export class TutorRegistrationComponent implements OnInit, DoCheck {
    ngDoCheck(): void {
        console.log(this.previewUrl)
    }


    tutorForm: FormGroup;
    email: string = '';

    selectedFile: File | null = null;
    previewUrl: SafeStyle | null = null;
    loading = false;
    error = '';

    currentUser?: UserProfile;

    constructor(
        private fb: FormBuilder,
        private tutorService: TutorService,
        private router: Router,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef,
        private sanitizer: DomSanitizer,
        private authService: AuthService,
    ) {
        this.tutorForm = this.fb.group({
            email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
            title: ['', [Validators.required, Validators.required]],
            bio: ['', Validators.required],
            hourlyRate: ['', [Validators.required, Validators.min(0)]],
            experienceYears: ['', [Validators.required, Validators.min(0)]],
            acceptsOneToOne: [true, Validators.required],
            acceptsOneToMany: [false, Validators.required],
            videoId: [''] // Optional
        });

    }

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


    onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            // Create preview
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.previewUrl = this.sanitizer.bypassSecurityTrustStyle(
                    `url(${e.target.result})`
                );

                this.cdr.detectChanges();
            };
            reader.readAsDataURL(file);
        }
    }


    onSubmit(): void {
        if (this.tutorForm.valid) {
            const formValue = this.tutorForm.getRawValue();

            const requestData = {
                email: formValue.email,
                title: formValue.title,
                bio: formValue.bio,
                hourlyRate: formValue.hourlyRate,
                experienceYears: formValue.experienceYears,
                acceptsOneToOne: formValue.acceptsOneToOne,
                acceptsOneToMany: formValue.acceptsOneToMany,
                videoId: formValue.videoId ?? '',
                userId: this.currentUser?.id,
                rating: 0,
                totalReviews: 0,
                status: 0,
                numberOfSessions: 0
            };

            const formData = new FormData();

            // ✅ Append JSON part with correct content type to match @RequestPart
            formData.append(
                'request',
                new Blob([JSON.stringify(requestData)], { type: 'application/json' })
            );

            // ✅ Append file with the name matching @RequestPart("file")
            if (this.selectedFile) {
                formData.append('file', this.selectedFile);
            }

            this.tutorService.registerTutor(formData).subscribe({
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
