import { Component, OnInit } from '@angular/core';
import { TimeSlot, TimeSlotService, TimeSlotRequest } from '../../core/services/time-slot.service';
import { CommonModule } from '@angular/common';

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

  constructor(private timeSlotService: TimeSlotService) { }

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
        console.log('Time slots response:', response);
          this.timeSlots = response.data.content;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching time slots:', err);
        this.error = 'Failed to load time slots';
        this.loading = false;
      }
    });
  }

  reserveSlot(slot: TimeSlot): void {
    if (confirm(`Are you sure you want to reserve the slot from ${slot.startTime} to ${slot.endTime}?`)) {
      this.timeSlotService.reserveTimeSlot(slot.id).subscribe({
        next: () => {
          alert('Time slot reserved successfully!');
          this.loadTimeSlots(); // Refresh the list
        },
        error: (err) => {
          console.error('Error reserving time slot:', err);
          alert('Failed to reserve time slot.');
        }
      });
    }
  }
}
