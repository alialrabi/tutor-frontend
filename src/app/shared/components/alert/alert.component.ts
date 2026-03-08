import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="message" class="alert alert-dismissible fade show" [ngClass]="'alert-' + type" role="alert">
      {{ message }}
      <button type="button" class="btn-close" aria-label="Close" (click)="message = ''"></button>
    </div>
  `,
  styles: [`
    .alert {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1050;
      min-width: 300px;
    }
  `]
})
export class AlertComponent {
  @Input() message = '';
  @Input() type: 'success' | 'danger' | 'warning' | 'info' = 'info';
}
