import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { JokeComponent } from "./joke/joke.component";
import { JokeContainerService } from '../../../service/joke/joke-container.service';
import { PageResponse } from '../../../model/PageResponse';
import { JokeDto } from '../../../model/JokeDto';
import { ActivatedRoute } from '@angular/router';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-joke-list',
  standalone: true,
  imports: [JokeComponent],
  templateUrl: './joke-list.component.html',
  styleUrl: './joke-list.component.scss'
})
export class JokeListComponent implements AfterViewInit {
  @ViewChild('jokeContainer', { read: ViewContainerRef }) jokeContainer!: ViewContainerRef;
  page: number = 0;

  constructor(private jokeListService: JokeContainerService, private route: ActivatedRoute) { }

  ngAfterViewInit() {
    this.route.url.subscribe(urlSegments => {
      if (urlSegments.length == 0) {
        this.loadJokes();
      }
      else {
        const path = urlSegments[0].path;
        if (path) {
          if (path === 'favorite') {
            this.loadFavoriteJokes();
          }
        }
      }
    });
  }

  loadJokes() {
    if (!this.jokeContainer) {
      return;
    }

    this.jokeContainer.clear();

    this.jokeListService.getJokes(this.page).subscribe(response => {
      response?.content.content.forEach((joke: JokeDto) => {
        const componentRef = this.jokeContainer.createComponent(JokeComponent);
        componentRef.setInput("joke", joke);
      });
    });
  }

  loadFavoriteJokes() {
    if (!this.jokeContainer) {
      return;
    }

    this.jokeContainer.clear();

    this.jokeListService.getFavoriteJokes(this.page).subscribe(response => {
      response?.content.content.forEach((joke: JokeDto) => {
        const componentRef = this.jokeContainer.createComponent(JokeComponent);
        componentRef.setInput("joke", joke);
      });
    });
  }
}
