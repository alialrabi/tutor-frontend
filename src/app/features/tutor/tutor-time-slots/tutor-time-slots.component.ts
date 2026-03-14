import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSlotService, TimeSlotDto } from '../../../core/services/time-slot.service';
import { SessionService, CreateSessionRequest } from '../../../core/services/session.service';

interface DailySchedule {
  date: string;
  slots: TimeSlotDto[];
}

@Component({
  selector: 'app-tutor-time-slots',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tutor-time-slots.component.html',
  styleUrls: ['./tutor-time-slots.component.css']
})
export class TutorTimeSlotsComponent implements OnInit {
  dailySchedules: DailySchedule[] = [];
  loading = true;
  error = '';

  constructor(
    private timeSlotService: TimeSlotService,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
    this.loadTutorAvailability();
  }

  loadTutorAvailability(): void {
    this.loading = true;
    // Assuming tutorId=1 for now. This would be dynamic in a real app.
    this.timeSlotService.getTutorTimeSlotsByTutorId(1).subscribe({
      next: (response: any) => {
        const slots = response.data || [];
        this.processSlots(slots);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load tutor availability.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  private processSlots(slots: TimeSlotDto[]): void {
    if (!slots || slots.length === 0) {
      this.dailySchedules = [];
      return;
    }

    // Group slots by the date string provided in the API response.
    const slotsByDate: { [key: string]: TimeSlotDto[] } = {};
    for (const slot of slots) {
      const dateKey = slot.date;
      if (!slotsByDate[dateKey]) {
        slotsByDate[dateKey] = [];
      }
      slotsByDate[dateKey].push(slot);
    }

    // Create schedule objects directly from the grouped data.
    const schedules: DailySchedule[] = Object.keys(slotsByDate).map(date => {
      return {
        date: date,
        slots: slotsByDate[date].sort((a, b) => a.startTime.localeCompare(b.startTime))
      };
    });

    // Sort the entire schedule by date to ensure chronological order.
    this.dailySchedules = schedules.sort((a, b) => a.date.localeCompare(b.date));
  }

  bookSession(slot: TimeSlotDto): void {
    if (confirm(`Are you sure you want to book the session from ${slot.startTime.slice(0,5)} to ${slot.endTime.slice(0,5)}?`)) {
      const request: CreateSessionRequest = {
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        tutorId: slot.tutorId
      };

      this.sessionService.createSession(request).subscribe({
        next: () => {
          alert('Session booked successfully!');
          this.loadTutorAvailability(); // Refresh the schedule
        },
        error: (err) => {
          alert('Failed to book session. Please try again.');
          console.error(err);
        }
      });
    }
  }
}
