import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { JokeComponent } from "./joke/joke.component";
import { JokeComponentRef, JokeContainerService } from '../../../service/joke/joke-container.service';
import { JokeDto } from '../../../model/JokeDto';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private jokeContainerService: JokeContainerService, private route: ActivatedRoute) { }

  ngAfterViewInit() {
    this.route.url.subscribe(urlSegments => {
      if (urlSegments.length == 0) {
        this.loadJokes('/jokes');
      }
      else {
        const path = urlSegments[0].path;
        if (path) {
          if (path === 'favorite') {
            this.loadJokes('/favorite');
          }
        }
      }
    });
  }

  loadJokes(url: string){
    this.jokeContainerService.loadJokes(url, this.page).subscribe(jokes => {
      jokes.forEach((jokeComponentRef: JokeComponentRef) => {
        const componentRef = this.jokeContainer.createComponent(JokeComponent);
        componentRef.setInput("joke", jokeComponentRef.joke);

        jokeComponentRef.componentRef = componentRef;
      })
    });
  }
}
