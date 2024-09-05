import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { JokeDto } from '../../model/JokeDto';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { PageResponse } from '../../model/PageResponse';
import { JokeQueueService } from '../joke-queue-service';
import { NotificationService, NotificationType } from '../notification.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryJokeService {
  pageResponse: PageResponse<JokeDto> | null = null;

  constructor(public queueService: JokeQueueService, private apiService: ApiService, private notificationService: NotificationService) { }

  loadPage(categoryId: number, page: number): Observable<PageResponse<JokeDto>> {
    return this.apiService.get<PageResponse<JokeDto>>('/joke/category/' + categoryId + '/' + page, { withCredentials: true });
  }

  getNextJoke(categoryId: number, page: number): Observable<JokeDto | null> {
    const joke = this.queueService.dequeue();

    if (joke) {
      return of(joke);
    }

    var totalPages = this.pageResponse?.content.totalPages ?? 0;
    var hasNextPage = totalPages >= page;

    if (hasNextPage && this.queueService.size() < 5) {
      return this.loadPage(categoryId, page).pipe(
        switchMap((response) => {
          this.pageResponse = response;
          this.queueService.enqueueAll(response.content.content);

          const newJoke = this.queueService.dequeue();

          if (newJoke) {
            return of(newJoke);
          } else {
            return of(null);
          }
        }),
        catchError((error) => {
          this.notificationService.showNotification(error.error.message, NotificationType.ERROR);
          return of(null);
        })
      );
    }

    return of(null);
  }

}
