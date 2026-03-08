import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-photo-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.css']
})
export class PhotoUploadComponent {
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onUpload(): void {
    if (!this.selectedFile) return;

    this.loading = true;
    this.error = '';

    this.authService.uploadProfilePicture(this.selectedFile).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = 'Failed to upload photo. Please try again.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSkip(): void {
    this.router.navigate(['/dashboard']);
  }
}
