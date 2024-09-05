import { ComponentRef, Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { PageResponse } from '../../model/PageResponse';
import { JokeDto } from '../../model/JokeDto';
import { catchError, map, Observable, of } from 'rxjs';
import { JokeComponent } from '../../app/home-page/joke-list/joke/joke.component';
import { NotificationService, NotificationType } from '../notification.service';

export class JokeComponentRef {
  constructor(public joke: JokeDto, public componentRef: ComponentRef<JokeComponent> | null) {}
}

@Injectable({
  providedIn: 'root'
})
export class JokeContainerService {
  jokes: JokeComponentRef[] = [];
  pageResponse: PageResponse<JokeDto> | null = null;

  constructor(private apiService: ApiService, private notificationService: NotificationService) { }

  loadJokes(url: string, page: number): Observable<JokeComponentRef[]> {
    this.jokes = [];

    return this.apiService.get<PageResponse<JokeDto>>(url + '?page=' + page, { withCredentials: true }).pipe(
      map((data: PageResponse<JokeDto> | null) => {
        this.pageResponse = data;

        if (data) {
          const jokes = data.content.content.map(joke => ({
            joke: joke,
            componentRef: null
          }));
          this.jokes.push(...jokes);
          return this.jokes;
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

  deleteJoke(jokeToDelete: JokeDto) {
    this.apiService.delete<Response>('/joke/' + jokeToDelete.id, { withCredentials: true }).subscribe({
      next: () => {
        this.notificationService.showNotification("Dowcip został usunięty prawidłowo");

        const index = this.jokes.findIndex(j => j.joke.id === jokeToDelete.id);
        if (index !== -1) {
          if (this.jokes[index].componentRef) {
            this.jokes[index].componentRef.destroy();
            this.jokes.splice(index, 1);
          }
        }
      },
      error: (response) => {
        this.notificationService.showNotification(response.error.error.message, NotificationType.ERROR);
      }
    })
  }
}
