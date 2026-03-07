import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tutor } from '../../shared/models/tutor.model';

@Injectable({
  providedIn: 'root'
})
export class TutorService {
  private readonly URL = 'http://localhost:8088';
  private readonly API = '/api/tutors';

  constructor(private http: HttpClient) {}

  registerTutor(tutorData: any): Observable<any> {
    return this.http.post(`${this.URL}${this.API}`, tutorData);
  }

  getTutorByUserId(userId: number): Observable<Tutor> {
    return this.http.get<Tutor>(`${this.URL}${this.API}/details/${userId}`);
  }
}
