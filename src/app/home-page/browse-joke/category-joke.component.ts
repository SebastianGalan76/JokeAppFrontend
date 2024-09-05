import { Component, OnInit } from '@angular/core';
import { JokeComponent } from "../joke-list/joke/joke.component";
import { JokeDto } from '../../../model/JokeDto';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../service/joke/category.service';
import { Category } from '../../../model/Category';
import { CategoryJokeService } from '../../../service/joke/category-joke.service';
import { PageResponse } from '../../../model/PageResponse';
import { NotificationService, NotificationType } from '../../../service/notification.service';
import { ProgressBarComponent, ProgressBarSettings } from "./progress-bar/progress-bar.component";

@Component({
  selector: 'app-browse-joke',
  standalone: true,
  imports: [JokeComponent, CommonModule, ProgressBarComponent],
  templateUrl: './browse-joke.component.html',
  styleUrl: './browse-joke.component.scss'
})
export class CategoryJokeComponent implements OnInit {
  joke: JokeDto | null = null;
  progressBar = new ProgressBarSettings();

  viewSettings = {
    showProgressBar: true,
    showPreviewButton: true,
    showNextButton: true,
  }

  jokeIndex: number = 0;
  totalAmount: number = 0;

  category: Category | null = null;
  pageResponse: PageResponse<JokeDto> | null = null;

  constructor(public service: CategoryJokeService, private route: ActivatedRoute, private categoryService: CategoryService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.service.queueService.clear();

    this.route.paramMap.subscribe(params => {
      var categoryUrl = params.get('url');

      this.categoryService.getCategories().subscribe({
        next: (categories) => {
          this.category = categories.filter(category => category.url == categoryUrl)[0];

          if (this.category) {
            this.progressBar.title = this.category.name;

            this.service.getNextJoke(this.category.id, this.getPage()).subscribe({
              next: (joke) => {
                this.joke = joke;

                this.totalAmount = this.service.pageResponse?.content.totalElements ?? 0;
                this.progressBar.right = this.totalAmount.toString();
                this.loadNextJoke();
              }
            });
          }
          else {
            this.notificationService.showNotification('Niepoprawny adres kategorii', NotificationType.ERROR);
          }
        }
      })
    });
  }

  loadNextJoke() {
    if (this.jokeIndex + 1 <= this.totalAmount) {
      this.jokeIndex++;
      this.progressBar.left = this.jokeIndex.toString();
      this.progressBar.progress = (this.jokeIndex - 1) / (this.totalAmount - 1) * 100;

      if (this.category) {
        this.service.getNextJoke(this.category?.id, this.getPage()).subscribe({
          next: (joke) => {
            this.joke = joke;
          }
        });
      }
    }
    else {
      this.notificationService.showNotification('Nie ma więcej dowcipów dla tej kategorii', NotificationType.ERROR);
    }
  }

  loadPreviousJoke() {
    if (this.jokeIndex - 1 >= 1) {
      this.jokeIndex--;
      this.progressBar.left = this.jokeIndex.toString();
      this.progressBar.progress = (this.jokeIndex - 1) / (this.totalAmount - 1) * 100;

      if (this.category) {
        this.service.getNextJoke(this.category?.id, this.getPage()).subscribe({
          next: (joke) => {
            this.joke = joke;
          }
        });
      }
    }
    else {
      this.notificationService.showNotification('Jest to pierwszy dowcip. Nie możesz się cofnąć', NotificationType.ERROR);
    }
  }

  getPage() {
    return parseInt((this.jokeIndex / 15).toString());
  }
}
