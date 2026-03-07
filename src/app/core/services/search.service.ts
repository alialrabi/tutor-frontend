import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tutor } from '../../shared/models/tutor.model';
import { HttpClient } from "@angular/common/http";

export interface Filter {
  columnName: string;
  operation: string;
  value: any;
}

export interface SortCriteria {
  // Define if needed, for now it's an empty array
}

export interface FilterRequest {
  filterList: Filter[];
  sortCriteria: SortCriteria[];
  page: number;
  size: number;
}

export interface TutorSearchResponse {
  data: {
    content: Tutor[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) {}

  private readonly URL = 'http://localhost:8088';
  private readonly API = '/api';

  getTutors(data: FilterRequest): Observable<Tutor[]> {
    return this.http.post<TutorSearchResponse>(`${this.URL}${this.API}/tutors/search`, data)
        .pipe(
        map(res => {
          console.log('Full Response:', res);
          return res.data.content;
        })
    );
  }
}
