import { Component, Input } from '@angular/core';
import { JokeDto } from '../../../../model/JokeDto';
import { CommonModule } from '@angular/common';
import { JokeService } from '../../../../service/joke/joke.service';
import { JokeMenuComponent } from "./joke-menu/joke-menu.component";
import { NotificationService } from '../../../../service/notification.service';
import { JokeQueueService } from '../../../../service/joke-queue-service';

@Component({
  selector: 'app-joke',
  standalone: true,
  imports: [CommonModule, JokeMenuComponent],
  templateUrl: './joke.component.html',
  styleUrl: './joke.component.scss'
})
export class JokeComponent {
  @Input() joke!: JokeDto;

  @Input() jokeQueueService: JokeQueueService | null = null;

  menuIsShown: boolean = false;

  constructor(private jokeService: JokeService, private notificationService: NotificationService) { }

  toggleMenu(){
    this.menuIsShown = !this.menuIsShown;
  }

  like() {
    if (this.joke.userRating == 0) {
      this.joke.likeAmount++;
      this.joke.userRating = 1;
    }
    else if (this.joke.userRating == 1) {
      this.joke.likeAmount--;
      this.joke.userRating = 0;
    }
    else {
      this.joke.likeAmount++;
      this.joke.dislikeAmount--;
      this.joke.userRating = 1;
    }

    this.jokeService.like(this.joke.id);

    if(this.jokeQueueService){
      this.jokeQueueService.updateJoke(this.joke);
    }
  }
  
  dislike() {
    if (this.joke.userRating == 0) {
      this.joke.dislikeAmount++;
      this.joke.userRating = -1;
    }
    else if (this.joke.userRating == -1) {
      this.joke.dislikeAmount--;
      this.joke.userRating = 0;
    }
    else {
      this.joke.dislikeAmount++;
      this.joke.likeAmount--;
      this.joke.userRating = -1;
    }

    this.jokeService.dislike(this.joke.id);

    if(this.jokeQueueService){
      this.jokeQueueService.updateJoke(this.joke);
    }
  }

  favorite(){
    this.joke.favorite = !this.joke.favorite;

    this.jokeService.favorite(this.joke.id);

    if(this.joke.favorite){
      this.notificationService.showNotification('Dodano dowcip do ulubionych');
    }
    else{
      this.notificationService.showNotification('Usunięto dowcip z ulubionych');
    }

    if(this.jokeQueueService){
      this.jokeQueueService.updateJoke(this.joke);
    }
  }
}
