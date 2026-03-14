import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimeSlot } from './time-slot.service';
import { Tutor, UserProfile } from '../../shared/models/tutor.model';

export interface Session {
  id: number; // Assuming a top-level ID for the session
  tutorId: number;
  tutor: Tutor;
  userProfile: UserProfile;
  roomId: string | null;
  date: string;
  startTime: string;
  endTime: string;
}

export interface CreateSessionRequest {
  date: string;
  startTime: string;
  endTime: string;
  tutorId: number;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly URL = 'http://localhost:8088';
  private readonly API = '/api/sessions';

  constructor(private http: HttpClient) {}

  createSession(request: CreateSessionRequest): Observable<any> {
    return this.http.post(`${this.URL}${this.API}/create`, request);
  }

  getSessionsByTutor(id: number): Observable<Session[]> {
    let params = new HttpParams().set('id', id);
    return this.http.get<Session[]>(`${this.URL}${this.API}/list/tutor`, { params });
  }

  getSessionsByUser(id: number): Observable<Session[]> {
    let params = new HttpParams().set('id', id);
    return this.http.get<Session[]>(`${this.URL}${this.API}/list/user`, { params });
  }
}
