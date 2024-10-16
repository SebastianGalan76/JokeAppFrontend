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
    if(this.categories != null){
      return of(this.categories);
    }

    const storedCategories = sessionStorage.getItem('categories');
    if (storedCategories) {
      this.categories = JSON.parse(storedCategories);

      if (this.categories) {
        return of(this.categories);
      }
    }

    return this.apiService.get<Category[]>("/categories", {withCredentials: true}).pipe(
      map(data => {
        if (data) {
          this.categories = data;
          sessionStorage.setItem('categories', JSON.stringify(this.categories));
          return this.categories;
        } else {
          return [];
        }
      }),
      catchError(error => {
        console.error('Błąd pobierania kategorii', error);
        return of([]);
      })
    );
  }

  favorite(id: number) : Observable<Response> {
    sessionStorage.setItem('categories', JSON.stringify(this.categories));
    return this.apiService.post<Response>('/category/'+id+"/favorite", null, {withCredentials: true});
  }

  updateCategoryIndex(id: number, newIndex: number): void {
    if (this.categories) {
      const index = this.categories.findIndex(category => category.id === id);
      if (index !== -1) {
        this.categories[index].index = newIndex;
  
        sessionStorage.setItem('categories', JSON.stringify(this.categories));
      }
    }
  }
}
