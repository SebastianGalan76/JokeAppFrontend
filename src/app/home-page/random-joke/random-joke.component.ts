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
  joke : JokeDto | null = null;

  constructor(public service: RandomJokeService){}
  
  ngOnInit(): void {
    this.loadNextJoke();
  }

  loadNextJoke(){
    this.joke = null;

    this.service.getRandomJoke().subscribe({
      next: (joke) => {
        this.joke = joke;
      }
    });
  }
}
