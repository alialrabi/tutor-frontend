import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tutor, UserProfile } from '../../shared/models/tutor.model';

export interface BaseDto {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommentDto extends BaseDto {
  content: string;
  tutorId: number;
  userProfile: UserProfile;
}

@Injectable({
  providedIn: 'root'
})
export class TutorService {
  private readonly URL = 'http://localhost:8088';
  private readonly API = '/api/tutors';
  private readonly COMMENTS_API = '/api/comments';

  constructor(private http: HttpClient) {}

  registerTutor(tutorData: any): Observable<any> {
    return this.http.post(`${this.URL}${this.API}`, tutorData);
  }

  getTutorByUserId(userId: number): Observable<Tutor> {
    return this.http.get<Tutor>(`${this.URL}${this.API}/details/${userId}`);
  }

  getTutorDetails(id: number): Observable<Tutor> {
    let params = new HttpParams().set('id', id);
    return this.http.get<Tutor>(`${this.URL}${this.API}/details`, { params });
  }

  getComments(tutorId: number): Observable<CommentDto[]> {
    return this.http.get<CommentDto[]>(`${this.URL}${this.COMMENTS_API}/tutor/${tutorId}`);
  }
}
