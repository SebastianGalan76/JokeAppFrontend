import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { PageContainerComponent } from '../page-container/page-container.component';
import { JokeComponentRef, JokeContainerService } from '../../../service/joke/joke-container.service';
import { JokeComponent } from '../joke-list/joke/joke.component';

@Component({
  selector: 'app-favorite-joke-list',
  standalone: true,
  imports: [PageContainerComponent],
  templateUrl: './favorite-joke-list.component.html',
  styleUrl: './favorite-joke-list.component.scss'
})
export class FavoriteJokeListComponent implements OnInit{
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

    this.jokeContainerService.loadJokes('/favorite', page).subscribe(jokes => {
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
