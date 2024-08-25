import { Component } from '@angular/core';
import { JokeComponent } from "./joke/joke.component";

@Component({
  selector: 'app-joke-list',
  standalone: true,
  imports: [JokeComponent],
  templateUrl: './joke-list.component.html',
  styleUrl: './joke-list.component.scss'
})
export class JokeListComponent {

}
