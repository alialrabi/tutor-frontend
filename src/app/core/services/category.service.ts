import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilterRequest } from './search.service';

export interface CategoryTutorsDto {
  id: number;
  name: string;
}

export interface CategorySearchResponse {
  data: {
    content: CategoryTutorsDto[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly URL = 'http://localhost:8088';
  private readonly API = '/api/categories';

  constructor(private http: HttpClient) {}

  getCategories(request: FilterRequest): Observable<CategoryTutorsDto[]> {
    return this.http.post<CategorySearchResponse>(`${this.URL}${this.API}/list`, request).pipe(
      map(res => {
        return res.data.content;
      })
    );
  }
}
