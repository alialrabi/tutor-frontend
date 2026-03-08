import { Component, OnInit } from '@angular/core';
import { TimeSlot, TimeSlotService, TimeSlotRequest } from '../../core/services/time-slot.service';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-tutor-time-slots',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tutor-time-slots.component.html',
  styleUrls: ['./tutor-time-slots.component.css']
})
export class TutorTimeSlotsComponent implements OnInit {
  timeSlots: TimeSlot[] = [];
  loading = true;
  error = '';
  selectedSlot: TimeSlot | null = null;

  constructor(
    private timeSlotService: TimeSlotService,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
    this.loadTimeSlots();
  }

  loadTimeSlots(): void {
    this.loading = true;
    const request: TimeSlotRequest = {
      filterList: [],
      sortCriteria: [],
      page: 0,
      size: 10
    };
    this.timeSlotService.getTimeSlots(request).subscribe({
      next: (response: any) => {
        if (response && response.data && Array.isArray(response.data.content)) {
          this.timeSlots = response.data.content;
        } else {
          this.timeSlots = [];
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load time slots';
        this.loading = false;
      }
    });
  }

  initiateReservation(slot: TimeSlot): void {
    this.selectedSlot = slot;
  }

  confirmReservation(): void {
    if (!this.selectedSlot) return;

    this.sessionService.createSession(this.selectedSlot.id).subscribe({
      next: () => {
        this.selectedSlot = null;
        this.loadTimeSlots(); // Refresh the list
      },
      error: (err) => {
        alert('Failed to create session.');
        this.selectedSlot = null;
      }
    });
  }

  cancelReservation(): void {
    this.selectedSlot = null;
  }
}
