import { Component, Input } from '@angular/core';
import { User } from '../../../../model/User';
import { ResponseMessage } from '../../../../model/ResponseMessage';
import { ApiService } from '../../../../service/api.service';
import { UserService } from '../../../../service/user.service';
import { NotificationService } from '../../../../service/notification.service';
import { ResponseStatusEnum } from '../../../../model/ResponseStatusEnum';
import { JokeList } from '../../../../model/JokeList';
import { ContentResponse } from '../../../../model/ContentResponse';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PopupService } from '../../../../service/popup.service';

@Component({
  selector: 'app-create-joke-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-joke-list.component.html',
  styleUrl: './create-joke-list.component.scss'
})
export class CreateJokeListComponent {
  @Input() user!: User;
  @Input() lists: JokeList[] = [];

  listName: string = '';
  accessibility: string = 'PUBLIC';

  newListFormIsVisible = false;
  responseMessage: ResponseMessage | null = null;

  constructor(private apiService: ApiService, private userService: UserService, private notificationService: NotificationService, private popupService: PopupService) { }

  createNewList() {
    if (this.listName.length == 0) {
      this.responseMessage = {
        status: ResponseStatusEnum.ERROR,
        message: "Nazwa listy nie może być pusta!"
      };
      return;
    }

    this.responseMessage = null;

    this.apiService.post<ContentResponse<JokeList>>('/joke-list', { name: this.listName, visibilityType: this.accessibility }, { withCredentials: true })
      .subscribe({
        next: (response) => {
          if (response.status === ResponseStatusEnum.SUCCESS) {
            this.user.jokeLists.push(response.content);
            this.lists.push(response.content);
            this.userService.saveUser();

            this.newListFormIsVisible = false;
            this.notificationService.showNotification('Stworzono prawidłowo listę '+this.listName);

            this.closePopup();
          }
        },
        error: (response) => {
          this.responseMessage = {
            status: ResponseStatusEnum.ERROR,
            message: response.error.error.message
          };
        }
      });

    this.listName = '';
    this.accessibility = 'PUBLIC';
  }

  showNewListForm() {
    this.newListFormIsVisible = true;
  }

  closePopup(){
    this.popupService.closePopup();
  }
}
