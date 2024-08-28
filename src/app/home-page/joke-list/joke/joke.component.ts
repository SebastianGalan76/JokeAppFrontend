import { Component, Input } from '@angular/core';
import { JokeDto } from '../../../../model/JokeDto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-joke',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './joke.component.html',
  styleUrl: './joke.component.scss'
})
export class JokeComponent {
  @Input() joke!: JokeDto;

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
  }

  favorite(){
    this.joke.favorite = !this.joke.favorite;
  }
}
