import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { PageContainerComponent } from '../page-container/page-container.component';
import { JokeComponentRef, JokeContainerService } from '../../../service/joke/joke-container.service';
import { JokeComponent } from '../joke-list/joke/joke.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../service/user.service';
import { User } from '../../../model/User';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favorite-joke-list',
  standalone: true,
  imports: [PageContainerComponent, CommonModule, RouterModule],
  templateUrl: './favorite-joke-list.component.html',
  styleUrl: './favorite-joke-list.component.scss'
})
export class FavoriteJokeListComponent implements OnInit{
  @ViewChild('jokeContainer', { read: ViewContainerRef }) jokeContainer!: ViewContainerRef;
  @ViewChild(PageContainerComponent) pageContainer!: PageContainerComponent;

  user: User | null = null;

  constructor(public jokeContainerService: JokeContainerService, private userService: UserService) { }

  ngOnInit(): void {
    this.loadJokes(0);

    this.userService.getUser().subscribe({
      next: (user) => {
        this.user = user;
      }
    })
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
