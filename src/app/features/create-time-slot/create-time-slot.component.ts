import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TimeSlotService, CreateTimeSlotRequest, TimeSlotDto } from '../../core/services/time-slot.service';
import { AuthService } from '../../core/services/auth.service';

interface WeekDay {
  name: string;
  value: number;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  enabled: boolean;
}

@Component({
  selector: 'app-create-time-slot',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-time-slot.component.html',
  styleUrls: ['./create-time-slot.component.css']
})
export class CreateTimeSlotComponent implements OnInit {
  weekDays: WeekDay[] = [
    { name: 'Monday', value: 1 },
    { name: 'Tuesday', value: 2 },
    { name: 'Wednesday', value: 3 },
    { name: 'Thursday', value: 4 },
    { name: 'Friday', value: 5 },
    { name: 'Saturday', value: 6 },
    { name: 'Sunday', value: 7 }
  ];
  timeSlots: TimeSlot[][] = []; // This holds the display data for time labels
  timeSlotsForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private timeSlotService: TimeSlotService,
    private authService: AuthService
  ) {
    this.timeSlotsForm = this.fb.group({
      days: this.fb.array([]) // FormArray for each day
    });
  }

  ngOnInit(): void {
    this.generateTimeSlots();
    this.loadExistingTimeSlots();
  }

  generateTimeSlots(): void {
    this.weekDays.forEach(() => {
      const daySlots: TimeSlot[] = [];
      for (let i = 0; i < 24; i++) {
        const startTime = `${i.toString().padStart(2, '0')}:00`;
        const endTime = `${(i + 1).toString().padStart(2, '0')}:00`;
        daySlots.push({ startTime, endTime, enabled: false });
      }
      this.timeSlots.push(daySlots);
    });

    // Initialize the form controls for each time slot in each day
    this.timeSlots.forEach((daySlots, dayIndex) => {
      const dayFormGroup = this.fb.group({});
      daySlots.forEach((slot, slotIndex) => {
        dayFormGroup.addControl(slotIndex.toString(), this.fb.control(false));
      });
      (this.timeSlotsForm.get('days') as FormArray).push(dayFormGroup);
    });
  }

  loadExistingTimeSlots(): void {
    this.timeSlotService.getTutorTimeSlots().subscribe({
      next: (response: any) => {
        response?.data.forEach((slot: any) => {
          // Backend sends 1 (Mon) - 7 (Sun). Our form array is 0-indexed.
          const dayIndex = slot.dayOfWeek - 1;
          
          if (dayIndex >= 0 && dayIndex < 7) { // Safety check
            const startTimeHour = parseInt(slot.startTime.split(':')[0], 10);
            
            const slotIndex = this.timeSlots[dayIndex].findIndex(
              ts => parseInt(ts.startTime.split(':')[0], 10) === startTimeHour
            );

            if (slotIndex !== -1) {
              this.getSlotControl(dayIndex, slotIndex).setValue(true);
            }
          }
        });
      },
      error: (err) => {
        console.error('Failed to load existing time slots:', err);
      }
    });
  }

  get daysFormArray(): FormArray {
    return this.timeSlotsForm.get('days') as FormArray;
  }

  getSlotControl(dayIndex: number, slotIndex: number): FormControl {
    return (this.daysFormArray.at(dayIndex) as FormGroup).get(slotIndex.toString()) as FormControl;
  }

  onSubmit(): void {
    if (this.timeSlotsForm.invalid) {
      this.errorMessage = 'Please fix the errors before submitting.';
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const requests: CreateTimeSlotRequest[] = [];

    this.weekDays.forEach((day, dayIndex) => {
      const dayFormGroup = this.daysFormArray.controls[dayIndex] as FormGroup;
      for (let i = 0; i < 24; i++) {
        if (dayFormGroup.get(i.toString())?.value) {
          const startTime = this.timeSlots[dayIndex][i].startTime;
          let endTime = this.timeSlots[dayIndex][i].endTime;

          if (i === 23) {
            endTime = '00:00';
          }

          requests.push({
            startTime: startTime,
            endTime: endTime,
            dayOfWeek: day.value // This will now correctly be 1-7
          });
        }
      }
    });

    /*if (requests.length === 0) {
      this.errorMessage = 'Please select at least one time slot.';
      this.loading = false;
      return;
    }*/

    this.timeSlotService.createTimeSlots(requests).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Weekly availability saved successfully!';
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Failed to save time slots. Please try again.';
        console.error(err);
      }
    });
  }
}
