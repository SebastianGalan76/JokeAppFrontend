import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { JokeComponent } from "./joke/joke.component";
import { JokeComponentRef, JokeContainerService } from '../../../service/joke/joke-container.service';
import { PageContainerComponent } from "../page-container/page-container.component";

@Component({
  selector: 'app-joke-list',
  standalone: true,
  imports: [JokeComponent, PageContainerComponent],
  templateUrl: './joke-list.component.html',
  styleUrl: './joke-list.component.scss'
})
export class JokeListComponent implements OnInit{
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

    this.jokeContainerService.loadJokes('/jokes', page).subscribe(jokes => {
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
