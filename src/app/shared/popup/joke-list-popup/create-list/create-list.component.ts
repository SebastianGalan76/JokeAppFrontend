import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../../service/api.service';
import { ContentResponse } from '../../../../../model/ContentResponse';
import { JokeList } from '../../../../../model/JokeList';
import { UserService } from '../../../../../service/user.service';
import { User } from '../../../../../model/User';
import { ResponseMessage } from '../../../../../model/ResponseMessage';
import { ResponseStatusEnum } from '../../../../../model/ResponseStatusEnum';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../../../../../service/notification.service';

@Component({
  selector: 'app-create-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-list.component.html',
  styleUrl: './create-list.component.scss'
})
export class CreateListComponent {
  @Input() user!: User;

  listName: string = '';
  accessibility: string = 'PUBLIC';

  newListFormIsVisible = false;
  responseMessage: ResponseMessage | null = null;

  constructor(private apiService: ApiService, private userService: UserService, private notificationService: NotificationService) { }

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
            this.userService.saveUser(this.user);

            this.newListFormIsVisible = false;
            this.notificationService.showNotification('Stworzono prawidłowo listę '+this.listName);
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
}
