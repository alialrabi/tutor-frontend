import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TimeSlot {
  id: number;
  tutorId: number;
  startTime: string;
  endTime: string;
  isReserved: boolean;
}

export interface TimeSlotListRequest {
  filterList: any[];
  sortCriteria: any[];
  page: number;
  size: number;
}

export interface CreateTimeSlotRequest {
  startTime: string;
  endTime: string;
  dayOfWeek: number;
}

export interface TimeSlotDto {
  id: number | null;
  date: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number;
  isReserved: boolean | null;
  tutorId: number;
}

@Injectable({
  providedIn: 'root'
})
export class TimeSlotService {
  private readonly URL = 'http://localhost:8088';
  private readonly API = '/api/time-slots';

  constructor(private http: HttpClient) {}

  getTimeSlots(request: TimeSlotListRequest): Observable<any> {
    return this.http.post<any>(`${this.URL}${this.API}/time-slots/list`, request);
  }

  createTimeSlots(requests: CreateTimeSlotRequest[]): Observable<any> {
    return this.http.post<any>(`${this.URL}${this.API}/create`, requests);
  }

  getTutorTimeSlots(): Observable<TimeSlotDto[]> {
    return this.http.get<TimeSlotDto[]>(`${this.URL}${this.API}/tutor/timeslots`);
  }

  getTutorTimeSlotsByTutorId(id: number): Observable<TimeSlotDto[]> {
    return this.http.get<TimeSlotDto[]>(`${this.URL}${this.API}/tutor/${id}/timeslots`);
  }

  reserveTimeSlot(id: number): Observable<any> {
    return this.http.post(`${this.URL}${this.API}/time-slots/reserve/${id}`, {});
  }
}
