import { Component, Input } from '@angular/core';
import { JokeDto } from '../../../../model/JokeDto';
import { CommonModule } from '@angular/common';
import { JokeService } from '../../../../service/joke/joke.service';

@Component({
  selector: 'app-joke',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './joke.component.html',
  styleUrl: './joke.component.scss'
})
export class JokeComponent {
  @Input() joke!: JokeDto;

  constructor(private jokeService: JokeService) {
    
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
  }

  favorite(){
    this.joke.favorite = !this.joke.favorite;

    this.jokeService.favorite(this.joke.id);
  }
}
