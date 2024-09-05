import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { JokeDto } from '../../model/JokeDto';
import { ContentResponse } from '../../model/ContentResponse';
import { NotificationService, NotificationType } from '../notification.service';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { JokeQueueService } from '../joke-queue-service';

@Injectable({
  providedIn: 'root'
})
export class RandomJokeService {
  constructor(private apiService: ApiService, public queueService: JokeQueueService, private notificationService: NotificationService) { }

  loadNextJokes(): Observable<ContentResponse<JokeDto[]>> {
    return this.apiService.get<ContentResponse<JokeDto[]>>('/joke/random?amount=15', { withCredentials: true });
  }

  getRandomJoke(): Observable<JokeDto | null> {
    const joke = this.queueService.dequeue();

    if (joke) {
      return of(joke);
    }

    if (this.queueService.size() < 5) {
      this.loadNextJokes().subscribe({
        next: (response) => {
          this.queueService.enqueueAll(response.content);
        },
        error: (response) => {
          this.notificationService.showNotification(response.error.error.message, NotificationType.ERROR);
        }
      });
    }

    return this.loadNextJokes().pipe(
      switchMap((response) => {
        this.queueService.enqueueAll(response.content);
        const newJoke = this.queueService.dequeue();

        if(newJoke){
          return of(newJoke);
        }
        else{
          return of(null);
        }
      }),
      catchError((error) => {
        this.notificationService.showNotification(error.error.message, NotificationType.ERROR);
        return of(null);
      })
    );
  }
}
