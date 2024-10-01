import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { PageContainerComponent } from '../page-container/page-container.component';
import { JokeComponentRef, JokeContainerService } from '../../../service/joke/joke-container.service';
import { JokeComponent } from '../joke-list/joke/joke.component';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(public jokeContainerService: JokeContainerService, private route:ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const page = params.get('page');
      if (page !== null) {
        const pageInt = parseInt(page, 10);
        this.loadJokes(pageInt);
      }
      else {
        this.loadJokes(1);
      }
    });
  }

  loadJokes(page: number) {
    page -= 1;
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
    this.router.navigate(['/best/page', page]);
  }
}
