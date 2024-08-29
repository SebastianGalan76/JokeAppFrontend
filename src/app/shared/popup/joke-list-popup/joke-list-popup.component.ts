import { Component, Input, OnInit } from '@angular/core';
import { PopupService } from '../../../../service/popup.service';
import { UserService } from '../../../../service/user.service';
import { JokeList, JokeListVisibilityEnum } from '../../../../model/JokeList';
import { CommonModule } from '@angular/common';
import { JokeDto } from '../../../../model/JokeDto';
import { User } from '../../../../model/User';
import { ApiService } from '../../../../service/api.service';
import { FormsModule } from '@angular/forms';
import { ContentResponse } from '../../../../model/ContentResponse';
import { CreateListComponent } from "./create-list/create-list.component";
import { JokeListService } from '../../../../service/joke/joke-list.service';

@Component({
  selector: 'app-joke-list-popup',
  standalone: true,
  imports: [CommonModule, FormsModule, CreateListComponent],
  templateUrl: './joke-list-popup.component.html',
  styleUrls: ['./joke-list-popup.component.scss']
})
export class JokeListPopupComponent implements OnInit {
  @Input({ required: true }) joke!: JokeDto;

  public JokeListVisibilityEnum = JokeListVisibilityEnum;
  user!: User;

  constructor(private popupService: PopupService, private userService: UserService, private jokeListService: JokeListService) { }

  ngOnInit(): void {
    this.userService.getUser().subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
  }

  closePopup() {
    this.popupService.closePopup();
  }

  hasJokeWithId(list: JokeList): boolean {
    return this.jokeListService.containsJoke(list, this.joke);
  }

  onCheckboxChange(list: JokeList, joke: JokeDto, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const isChecked = inputElement.checked;

    if (isChecked && list) {
      this.jokeListService.addJokeToList(this.user, joke, list);

    } else if (list) {
      this.jokeListService.removeJokeFromList(this.user, joke, list);
    }
  }
}
