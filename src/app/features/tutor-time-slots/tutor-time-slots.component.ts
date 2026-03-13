import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSlotService, TimeSlotDto } from '../../core/services/time-slot.service';

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

  constructor(private timeSlotService: TimeSlotService) { }

  ngOnInit(): void {
    this.loadTutorAvailability();
  }

  loadTutorAvailability(): void {
    this.loading = true;
    // Assuming you want to fetch for a specific tutor, e.g., tutorId=1
    this.timeSlotService.getTutorTimeSlotsByTutorId(1).subscribe({
      next: (response: any) => {
        this.processSlots(response.data);
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
    const schedules: DailySchedule[] = [];
    const today = new Date();
    
    // Create a map of dates to slots for easy lookup
    const slotsByDate: { [key: string]: TimeSlotDto[] } = {};
    if (slots) {
      for (const slot of slots) {
        const date = slot.date;
        if (!slotsByDate[date]) {
          slotsByDate[date] = [];
        }
        slotsByDate[date].push(slot);
      }
    }

    // Generate the next 7 days and map the slots
    for (let i = 1; i < 6; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      const dateString = nextDay.toISOString().split('T')[0];

      const daySlots = slotsByDate[dateString] || [];
      
      schedules.push({
        date: dateString,
        slots: daySlots.sort((a, b) => a.startTime.localeCompare(b.startTime))
      });
    }
    
    this.dailySchedules = schedules;
  }
}
