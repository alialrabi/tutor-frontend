import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DailyRoom {
  name: string;
  roomUrl: string;
  privacy: 'public' | 'private';
}

export interface RoomRequest {
  sessionId: number;
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private readonly URL = 'http://localhost:8088';
  private readonly API = '/api/daily';

  constructor(private http: HttpClient) {}

  /**
   * Asks the backend to create a new video call room.
   * @param sessionId The ID of the session for which to create the room.
   * @returns An observable with the room details.
   */
  createRoom(sessionId: number): Observable<DailyRoom> {
    const request: RoomRequest = { sessionId };
    return this.http.post<DailyRoom>(`${this.URL}${this.API}/room`, request);
  }
}
