import { Component, HostListener, OnInit } from '@angular/core';
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

    hasNextJoke: false,
    hasPreviousJoke: false,
  }

  jokeIndex: number = 0;
  totalAmount: number = 0;

  category!: Category;

  constructor(public service: CategoryJokeService, private route: ActivatedRoute, private categoryService: CategoryService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      var categoryUrl = params.get('url');

      this.categoryService.getCategories().subscribe({
        next: (categories) => {
          this.category = categories.filter(category => category.url == categoryUrl)[0];

          if (this.category) {
            this.jokeIndex = this.category.index > 0 ? this.category.index : 0;
            this.progressBar.title = this.category.name;

            this.service.loadPage(this.category.id, this.getPage(), this.jokeIndex).subscribe({
              next: (joke) => {
                this.totalAmount = this.service.pageResponse?.content.totalElements ?? 0;
                this.progressBar.right = this.totalAmount.toString();

                this.setJoke(joke);
                this.refreshButtonViews();
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
    if (!this.viewSettings.hasNextJoke) {
      return;
    }

    if (this.jokeIndex + 1 < this.totalAmount) {
      const currentPage = this.getPage();
      this.jokeIndex++;
      const nextPage = this.getPage();
      var index = parseInt((this.jokeIndex % 15).toString());

      if (currentPage < nextPage) {
        this.service.loadPage(this.category?.id, nextPage, 0).subscribe({
          next: (joke) => {
            this.setJoke(joke);
            this.categoryService.updateCategoryIndex(this.category.id, this.jokeIndex);
          }
        });
      }
      else {
        this.service.getJoke(index).subscribe({
          next: (joke) => {
            this.setJoke(joke);
            this.categoryService.updateCategoryIndex(this.category.id, this.jokeIndex);
            this.refreshButtonViews();
          }
        });
      }
    }
  }

  loadPreviousJoke() {
    if (!this.viewSettings.hasPreviousJoke) {
      return;
    }

    if (this.jokeIndex - 1 >= 0) {
      const currentPage = this.getPage();
      this.jokeIndex--;
      const previousPage = this.getPage();
      var index = parseInt((this.jokeIndex % 15).toString());

      if (previousPage < currentPage) {
        this.service.loadPage(this.category?.id, previousPage, 14).subscribe({
          next: (joke) => {
            this.setJoke(joke);
            this.categoryService.updateCategoryIndex(this.category.id, this.jokeIndex);
          }
        });
      }
      else {
        this.service.getJoke(index).subscribe({
          next: (joke) => {
            this.setJoke(joke);
            this.categoryService.updateCategoryIndex(this.category.id, this.jokeIndex);
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

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowLeft':
        this.loadPreviousJoke();
        break;
      case 'ArrowRight':
        this.loadNextJoke();
        break;
      default:
        break;
    }
  }
}
