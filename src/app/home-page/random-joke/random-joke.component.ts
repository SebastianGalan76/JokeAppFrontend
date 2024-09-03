import { Component, OnInit } from '@angular/core';
import { JokeComponent } from "../joke-list/joke/joke.component";
import { JokeDto } from '../../../model/JokeDto';
import { RandomJokeService } from '../../../service/joke/random-joke.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-browse-joke',
  standalone: true,
  imports: [JokeComponent, CommonModule],
  templateUrl: './random-joke.component.html',
  styleUrl: './random-joke.component.scss'
})
export class RandomJokeComponent implements OnInit{
  viewSettings = {
    progressBar: {
      show: false,
      left: '',
      title: '',
      right: ''
    },
    showPreviewButton: false,
    showNextButton: true,
  }

  joke : JokeDto | null = null;

  constructor(private randomJokeService: RandomJokeService){}
  
  ngOnInit(): void {
    this.loadNextJoke();
  }

  loadNextJoke(){
    this.joke = null;

    this.randomJokeService.getRandomJoke().subscribe({
      next: (joke) => {
        this.joke = joke;
      }
    });
  }
}
