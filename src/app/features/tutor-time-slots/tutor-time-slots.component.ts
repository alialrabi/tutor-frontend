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

    for (let i = 0; i < 7; i++) {
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
