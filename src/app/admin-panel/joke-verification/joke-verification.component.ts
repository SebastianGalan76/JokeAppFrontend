import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { JokeComponent } from '../../home-page/joke-list/joke/joke.component';
import { JokeDto } from '../../../model/JokeDto';
import { Category } from '../../../model/Category';
import { ActivatedRoute } from '@angular/router';
import { NotificationService, NotificationType } from '../../../service/notification.service';
import { ProgressBarComponent, ProgressBarSettings } from '../../home-page/browse-joke/progress-bar/progress-bar.component';
import { ApiService } from '../../../service/api.service';
import { Observable, of } from 'rxjs';
import { PageResponse } from '../../../model/PageResponse';

@Component({
  selector: 'app-joke-verification',
  standalone: true,
  imports: [JokeComponent, CommonModule, ProgressBarComponent],
  templateUrl: './joke-verification.component.html',
  styleUrl: './joke-verification.component.scss'
})
export class JokeVerificationComponent {
  joke: JokeDto | null = null;
  progressBar = new ProgressBarSettings();

  pageResponse: PageResponse<JokeDto> | null = null;

  viewSettings = {
    showProgressBar: true,
    showPreviewButton: true,
    showNextButton: true,

    hasNextJoke: false,
    hasPreviousJoke: false,
  }

  jokeIndex: number = 0;
  totalAmount: number = 0;

  category!: Category;

  constructor(public apiService: ApiService, private route: ActivatedRoute, private notificationService: NotificationService) { }

  ngOnInit(): void {
    var jokeIndex = parseInt(this.route.snapshot.paramMap.get('index')!);

    if (!jokeIndex) {
      jokeIndex = 0;
    }

    var page = Math.floor(jokeIndex / 15);
    var index = jokeIndex % 15;

    this.loadPage(page, index).subscribe({
      next: (jokeDto) => {
        if (jokeDto) {
          this.joke = jokeDto;
        }

        this.refreshButtonViews();
      }
    })
  }

  accept() {
    this.apiService.post('/joke/' + this.joke?.id + "/accept", null, { withCredentials: true }).subscribe({
      next: () => {
        this.loadNextJoke();
      }
    })
  }

  reject() {
    this.apiService.post('/joke/' + this.joke?.id + "/reject", {reason: ""}, { withCredentials: true }).subscribe({
      next: () => {
        this.loadNextJoke();
      }
    })
  }

  loadNextJoke(){
    if (!this.viewSettings.hasNextJoke) {
      return;
    }

    if (this.jokeIndex + 1 < this.totalAmount) {
      const currentPage = this.getPage();
      this.jokeIndex++;
      const nextPage = this.getPage();
      var index = parseInt((this.jokeIndex % 15).toString());

      if (currentPage < nextPage) {
        this.loadPage(nextPage, 0).subscribe({
          next: (joke) => {
            this.setJoke(joke);
          }
        });
      }
      else {
        this.getJoke(index).subscribe({
          next: (joke) => {
            this.setJoke(joke);
            this.refreshButtonViews();
          }
        });
      }
    }
  }

  setJoke(joke: JokeDto | null) {
    this.joke = joke;
    this.progressBar.left = (this.jokeIndex + 1).toString();
    this.progressBar.progress = ((this.jokeIndex + 1) / this.totalAmount) * 100;
  }

  getPage() {
    return parseInt((this.jokeIndex / 15).toString());
  }

  refreshButtonViews() {
    if (this.jokeIndex == 0) {
      this.viewSettings.hasPreviousJoke = false;
    }
    else {
      this.viewSettings.hasPreviousJoke = true;
    }

    if (this.jokeIndex == this.totalAmount - 1) {
      this.viewSettings.hasNextJoke = false;
    }
    else {
      this.viewSettings.hasNextJoke = true;
    }
  }

  loadPage(page: number, index: number): Observable<JokeDto | null> {
    return new Observable<JokeDto | null>((observer) => {
      this.apiService.get<PageResponse<JokeDto>>('/joke/unverified/' + page, { withCredentials: true }).subscribe({
        next: (response) => {
          this.pageResponse = response;
          this.totalAmount = this.pageResponse.content.totalElements;

          if (this.pageResponse && this.pageResponse.content && index >= 0 && index < this.pageResponse.content.content.length) {
            observer.next(this.pageResponse.content.content[index]);
          } else {
            observer.next(null);
          }
          observer.complete();
        },
        error: (response) => {
          this.notificationService.showNotification(response.error.error.message, NotificationType.ERROR);
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
