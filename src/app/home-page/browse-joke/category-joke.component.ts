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

  category!: Category;

  constructor(public service: CategoryJokeService, private route: ActivatedRoute, private categoryService: CategoryService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      var categoryUrl = params.get('url');

      this.categoryService.getCategories().subscribe({
        next: (categories) => {
          this.category = categories.filter(category => category.url == categoryUrl)[0];

          if (this.category) {
            this.jokeIndex = 0;
            this.progressBar.title = this.category.name;

            this.service.loadPage(this.category.id, this.getPage(), this.jokeIndex).subscribe({
              next: (joke) => {
                this.totalAmount = this.service.pageResponse?.content.totalElements ?? 0;
                this.progressBar.right = this.totalAmount.toString();

                this.setJoke(joke);
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
    if (this.jokeIndex + 1 < this.totalAmount) {
      const currentPage = this.getPage();
      this.jokeIndex++;
      const nextPage = this.getPage();
      var index = parseInt((this.jokeIndex % 15).toString());

      if (currentPage < nextPage) {
        this.service.loadPage(this.category?.id, nextPage, 0).subscribe({
          next: (joke) => {
            this.setJoke(joke);
          }
        });
      }
      else {
        this.service.getJoke(index).subscribe({
          next: (joke) => {
            this.setJoke(joke);
          }
        });
      }
    }
  }

  loadPreviousJoke() {
    if (this.jokeIndex - 1 >= 0) {
      const currentPage = this.getPage();
      this.jokeIndex--;
      const previousPage = this.getPage();
      var index = parseInt((this.jokeIndex % 15).toString());

      if (previousPage < currentPage) {
        this.service.loadPage(this.category?.id, previousPage, 14).subscribe({
          next: (joke) => {
            this.setJoke(joke);
          }
        });
      }
      else {
        this.service.getJoke(index).subscribe({
          next: (joke) => {
            this.setJoke(joke);
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
}
