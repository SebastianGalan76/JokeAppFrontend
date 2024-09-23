import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { JokeDto } from '../../../../model/JokeDto';
import { CommonModule } from '@angular/common';
import { JokeService } from '../../../../service/joke/joke.service';
import { JokeMenuComponent } from "./joke-menu/joke-menu.component";
import { NotificationService, NotificationType } from '../../../../service/notification.service';
import { JokeQueueService } from '../../../../service/joke-queue-service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UserService } from '../../../../service/user.service';

@Component({
  selector: 'app-joke',
  standalone: true,
  imports: [CommonModule, JokeMenuComponent],
  templateUrl: './joke.component.html',
  styleUrl: './joke.component.scss'
})
export class JokeComponent implements OnChanges {
  @Input() joke!: JokeDto;
  formattedJoke!: SafeHtml;

  @Input() jokeQueueService: JokeQueueService | null = null;

  menuIsShown: boolean = false;

  constructor(private jokeService: JokeService, private userService: UserService, private notificationService: NotificationService) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['joke'] && changes['joke'].currentValue) {
      this.joke.content = this.joke.content.replace(/\\n/g, '\n');
    }
  }

  toggleMenu() {
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

    if (this.jokeQueueService) {
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

    if (this.jokeQueueService) {
      this.jokeQueueService.updateJoke(this.joke);
    }
  }

  favorite() {
    this.userService.getUser().subscribe({
      next: (user) => {
        if (user) {
          this.joke.favorite = !this.joke.favorite;

          this.jokeService.favorite(this.joke.id);

          if (this.joke.favorite) {
            this.notificationService.showNotification('Dodano dowcip do ulubionych');
          }
          else {
            this.notificationService.showNotification('Usunięto dowcip z ulubionych');
          }

          if (this.jokeQueueService) {
            this.jokeQueueService.updateJoke(this.joke);
          }
        }
        else{
          this.notificationService.showNotification('Zaloguj się, aby dodawać dowcipy do ulubionych', NotificationType.ERROR);
        }
      }
    })
  }
}
