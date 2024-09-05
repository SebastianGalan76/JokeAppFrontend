import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { JokeComponent } from "./joke/joke.component";
import { JokeComponentRef, JokeContainerService } from '../../../service/joke/joke-container.service';
import { ActivatedRoute } from '@angular/router';
import { PageContainerComponent } from "../page-container/page-container.component";

@Component({
  selector: 'app-joke-list',
  standalone: true,
  imports: [JokeComponent, PageContainerComponent],
  templateUrl: './joke-list.component.html',
  styleUrl: './joke-list.component.scss'
})
export class JokeListComponent implements AfterViewInit {
  @ViewChild('jokeContainer', { read: ViewContainerRef }) jokeContainer!: ViewContainerRef;
  @ViewChild(PageContainerComponent) pageContainer!: PageContainerComponent;

  url: string = '';

  constructor(public jokeContainerService: JokeContainerService, private route: ActivatedRoute) { }

  ngAfterViewInit() {
    this.route.url.subscribe(urlSegments => {
      if (urlSegments.length == 0) {
        this.url = '/jokes';

        this.loadJokes(0);
      }
      else {
        const path = urlSegments[0].path;
        if (path) {
          if (path === 'favorite') {
            this.url = '/favorite';
            this.loadJokes(0);
          }
        }
      }
    });
  }

  loadJokes(page: number) {
    this.jokeContainer.clear();

    this.jokeContainerService.loadJokes(this.url, page).subscribe(jokes => {
      jokes.forEach((jokeComponentRef: JokeComponentRef) => {
        const componentRef = this.jokeContainer.createComponent(JokeComponent);
        componentRef.setInput("joke", jokeComponentRef.joke);

        jokeComponentRef.componentRef = componentRef;
      })

      this.pageContainer.initialize(this.jokeContainerService.pageResponse);
    });
  }

  onChangePage(page: number){
    this.loadJokes(page)
  }
}
