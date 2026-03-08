import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimeSlot } from './time-slot.service';
import { Tutor, UserProfile } from '../../shared/models/tutor.model';

export interface Session {
  tutorId: number;
  tutor: Tutor;
  userProfile: UserProfile;
  timeSlot: TimeSlot;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly URL = 'http://localhost:8088';
  private readonly API = '/api/sessions';

  constructor(private http: HttpClient) {}

  createSession(timeSlotId: number): Observable<any> {
    return this.http.post(`${this.URL}${this.API}/create`, { timeSlotId });
  }

  getSessionsByTutor(tutorId: number): Observable<Session[]> {
    let params = new HttpParams().set('id', tutorId);
    return this.http.get<Session[]>(`${this.URL}${this.API}/list/tutor` , {params});
  }

  getSessionsByUser(userId: number): Observable<Session[]> {
    let params = new HttpParams().set('id', userId);
    return this.http.get<Session[]>(`${this.URL}${this.API}/list/user`, {params});
  }
}
