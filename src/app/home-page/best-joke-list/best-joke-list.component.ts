import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { PageContainerComponent } from '../page-container/page-container.component';
import { JokeComponentRef, JokeContainerService } from '../../../service/joke/joke-container.service';
import { JokeComponent } from '../joke-list/joke/joke.component';

@Component({
  selector: 'app-best-joke-list',
  standalone: true,
  imports: [PageContainerComponent],
  templateUrl: './best-joke-list.component.html',
  styleUrl: './best-joke-list.component.scss'
})
export class BestJokeListComponent {
  @ViewChild('jokeContainer', { read: ViewContainerRef }) jokeContainer!: ViewContainerRef;
  @ViewChild(PageContainerComponent) pageContainer!: PageContainerComponent;

  constructor(public jokeContainerService: JokeContainerService) { }

  ngOnInit(): void {
    this.loadJokes(0);
  }

  loadJokes(page: number) {
    if(this.jokeContainer){
      this.jokeContainer.clear();
    }

    this.jokeContainerService.loadJokes('/jokes/best', page).subscribe(jokes => {
      jokes.forEach((jokeComponentRef: JokeComponentRef) => {
        const componentRef = this.jokeContainer.createComponent(JokeComponent);
        componentRef.setInput("joke", jokeComponentRef.joke);

        jokeComponentRef.componentRef = componentRef;
      })

      this.pageContainer.initialize(this.jokeContainerService.pageResponse, page);
    });
  }

  onChangePage(page: number){
    this.loadJokes(page)
  }
}
