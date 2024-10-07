import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JokeList, JokeListVisibilityEnum } from '../../../../../model/JokeList';
import { UserService } from '../../../../../service/user.service';
import { User } from '../../../../../model/User';
import { ResponseMessage } from '../../../../../model/ResponseMessage';
import { ResponseStatusEnum } from '../../../../../model/ResponseStatusEnum';
import { NotificationService } from '../../../../../service/notification.service';
import { JokeListService } from '../../../../../service/joke/joke-list.service';
import { PopupService } from '../../../../../service/popup.service';

@Component({
  selector: 'app-edit-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-list.component.html',
  styleUrl: './edit-list.component.scss'
})
export class EditListComponent implements OnInit{
  @Input() jokeList!: JokeList

  listName: string = '';
  accessibility: string = 'PUBLIC';

  visibilityEnym!: JokeListVisibilityEnum;

  responseMessage: ResponseMessage | null = null;

  constructor(private jokeListService: JokeListService, private userService: UserService, private notificationService: NotificationService, private popupService: PopupService) { }
  
  ngOnInit(): void {
    this.listName = this.jokeList.name;
    this.accessibility = this.jokeList.visibilityType;
  }

  editList() {
    if (this.listName.length == 0) {
      this.responseMessage = {
        status: ResponseStatusEnum.ERROR,
        message: "Nazwa listy nie może być pusta!"
      };
      return;
    }

    this.responseMessage = null;

    this.jokeListService.editJokeList(this.jokeList, this.listName, this.accessibility)
      .subscribe({
        next: (response) => {
          if (response.status === ResponseStatusEnum.SUCCESS) {
            this.userService.getUser().subscribe({
              next: (user) => {
                if (user) {
                  const joke = user.jokeLists.find(j => j.id === this.jokeList.id);
                  if (joke) {
                    joke.name = this.listName;

                    if (Object.values(JokeListVisibilityEnum).includes(this.accessibility as JokeListVisibilityEnum)) {
                      joke.visibilityType = this.accessibility as JokeListVisibilityEnum;
                    }
                  }
                  this.userService.saveUser();

                  this.notificationService.showNotification('Edytowano prawidłowo listę ');
                  this.popupService.closePopup();
                }
              }
            })
          }
        },
        error: (response) => {
          this.responseMessage = {
            status: ResponseStatusEnum.ERROR,
            message: response.error.error.message
          };
        }
      });
  }
}
