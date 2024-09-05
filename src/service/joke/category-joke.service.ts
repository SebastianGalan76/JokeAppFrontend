import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { JokeDto } from '../../model/JokeDto';
import { Observable, of } from 'rxjs';
import { PageResponse } from '../../model/PageResponse';
import { NotificationService, NotificationType } from '../notification.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryJokeService {
  pageResponse: PageResponse<JokeDto> | null = null;

  constructor(private apiService: ApiService, private notificationService: NotificationService) { }

  loadPage(categoryId: number, page: number, index: number): Observable<JokeDto | null> {
    return new Observable<JokeDto | null>((observer) => {
      this.apiService.get<PageResponse<JokeDto>>('/joke/category/' + categoryId + '/' + page, { withCredentials: true }).subscribe({
        next: (response) => {
          this.pageResponse = response;

          if (this.pageResponse && this.pageResponse.content && index >= 0 && index < this.pageResponse.content.content.length) {
            observer.next(this.pageResponse.content.content[index]);
          } else {
            observer.next(null);
          }
          observer.complete();
        },
        error: (response) => {
          this.notificationService.showNotification(response.error.message, NotificationType.ERROR);
          observer.next(null);
          observer.complete();
        }
      });
    });
  }

  getJoke(index: number): Observable<JokeDto | null> {
    if (this.pageResponse) {
      const list = this.pageResponse.content.content;

      if (index >= 0 && index < list?.length) {
        return of(list[index]);
      }
    }
    return of(null);
  }
}
