import { Component, Input } from '@angular/core';
import { JokeDto } from '../../../../model/JokeDto';
import { CommonModule } from '@angular/common';
import { JokeContainerService } from '../../../../service/joke/joke-container.service';
import { PopupService } from '../../../../service/popup.service';

@Component({
  selector: 'app-remove-joke-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './remove-joke-confirm.component.html',
  styleUrl: './remove-joke-confirm.component.scss'
})
export class RemoveJokeConfirmComponent {
  @Input({ required: true }) joke!: JokeDto;

  constructor(private jokeContainerService: JokeContainerService, private popupService: PopupService){}

  confirm(){
    this.jokeContainerService.deleteJoke(this.joke);
    this.popupService.closePopup();
  }

  cancel(){
    this.popupService.closePopup();
  }
}
