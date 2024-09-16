import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { JokeComponentRef } from '../../../service/joke/joke-container.service';
import { PageContainerComponent } from "../page-container/page-container.component";
import { JokeComponent } from '../joke-list/joke/joke.component';
import { JokeListService } from '../../../service/joke/joke-list.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-joke-container',
  standalone: true,
  imports: [PageContainerComponent],
  templateUrl: './list-joke-container.component.html',
  styleUrl: './list-joke-container.component.scss'
})
export class ListJokeContainerComponent implements AfterViewInit {
  @ViewChild('jokeContainer', { read: ViewContainerRef }) jokeContainer!: ViewContainerRef;
  @ViewChild(PageContainerComponent) pageContainer!: PageContainerComponent;

  uuid: string = '';

  constructor(private jokeListService: JokeListService, private route: ActivatedRoute) { }
  
  ngAfterViewInit(): void {
    this.uuid = this.route.snapshot.paramMap.get('uuid')!;
    this.loadJokes();
  }

  loadJokes() {
    if (this.jokeContainer) {
      this.jokeContainer.clear();
    }

    this.jokeListService.getJokeList(this.uuid).subscribe({
      next: (response) => {
        if (response) {
          const jokes = response.jokes.map(joke => ({
            joke: joke,
            componentRef: null
          }));

          jokes.forEach((jokeComponentRef: JokeComponentRef) => {
            const componentRef = this.jokeContainer.createComponent(JokeComponent);
            componentRef.setInput("joke", jokeComponentRef.joke);

            jokeComponentRef.componentRef = componentRef;
          })
        }
      }
    })
  }

  onChangePage(page: number) {
    this.loadJokes()
  }
}
