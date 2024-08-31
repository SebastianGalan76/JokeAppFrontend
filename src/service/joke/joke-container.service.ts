import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { PageResponse } from '../../model/PageResponse';
import { JokeDto } from '../../model/JokeDto';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JokeContainerService {
  constructor(private apiService: ApiService) { }

  getJokes(page: number): Observable<PageResponse<JokeDto> | null> {
    return this.apiService.get<PageResponse<JokeDto>>('/jokes?page=' + page, { withCredentials: true }).pipe(
      map(data => {
        if (data) {
          return data;
        } else {
          return null;
        }
      }),
      catchError(error => {
        console.error('Błąd pobierania użytkownika', error);
        return of(null);
      })
    );
  }

  getFavoriteJokes(page: number): Observable<PageResponse<JokeDto> | null> {
    return this.apiService.get<PageResponse<JokeDto>>('/favorite?page=' + page, { withCredentials: true }).pipe(
      map(data => {
        if (data) {
          return data;
        } else {
          return null;
        }
      }),
      catchError(error => {
        console.error('Błąd pobierania użytkownika', error);
        return of(null);
      })
    );
  }
}
