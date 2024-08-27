import { Injectable } from '@angular/core';
import { Category } from '../../model/Category';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categories: Category[] | null = null;

  constructor(private apiService: ApiService) { }

  getCategories(): Observable<Category[]> {
    if (this.categories) {
      return of(this.categories);
    }

    return this.apiService.get<Category[]>("/categories", {}).pipe(
      map(data => {
        if (data) {
          this.categories = data;
          return this.categories;
        } else {
          return [];
        }
      }),
      catchError(error => {
        console.error('Błąd pobierania użytkownika', error);
        return of([]);
      })
    );
  }
}
