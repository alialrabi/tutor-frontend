import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CategoryTutorsDto {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly URL = 'http://localhost:8088';
  private readonly API = '/api/categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<CategoryTutorsDto[]> {
    return this.http.get<CategoryTutorsDto[]>(`${this.URL}${this.API}/list`);
  }
}
