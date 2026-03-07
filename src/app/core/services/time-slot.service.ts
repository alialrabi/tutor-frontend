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

export interface TimeSlotRequest {
  filterList: any[];
  sortCriteria: any[];
  page: number;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class TimeSlotService {
  private readonly URL = 'http://localhost:8088';
  private readonly API = '/api/time-slots';

  constructor(private http: HttpClient) {}

  getTimeSlots(request: TimeSlotRequest): Observable<any> {
    return this.http.post<any>(`${this.URL}${this.API}/list`, request);
  }

  reserveTimeSlot(id: number): Observable<any> {
    return this.http.post(`${this.URL}${this.API}/reserve/${id}`, {});
  }
}
