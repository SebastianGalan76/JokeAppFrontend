import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { FormsModule } from '@angular/forms';
import { ListComponent } from "./list/list.component";
import { JokeList } from '../../../model/JokeList';
import { User } from '../../../model/User';
import { RouterModule } from '@angular/router';
import { PopupService } from '../../../service/popup.service';
import { CreateListComponent } from '../../shared/popup/joke-list-popup/create-list/create-list.component';
import { CreateJokeListComponent } from '../../shared/popup/create-joke-list/create-joke-list.component';
import { JokeListService } from '../../../service/joke/joke-list.service';
import { NotificationService, NotificationType } from '../../../service/notification.service';

@Component({
  selector: 'app-user-joke-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ListComponent, RouterModule],
  templateUrl: './user-joke-list.component.html',
  styleUrl: './user-joke-list.component.scss'
})
export class UserJokeListComponent {
  listName: string = '';
  lists: JokeList[] = [];
  user: User | null = null;

  constructor(private userService: UserService, private jokeListService: JokeListService, private popupService: PopupService, private notificationSErvice: NotificationService) { }

  ngOnInit(): void {
    this.loadLists();
  }

  loadLists() {
    this.userService.getUser().subscribe({
      next: (user) => {
        if (user) {
          this.user = user;

          if (user.jokeLists) {
            this.lists = user?.jokeLists.filter(list => list.name.toLocaleLowerCase().includes(this.listName.toLocaleLowerCase()));
          }
        }
      }
    })
  }

  addNewList() {
    this.popupService.showPopup(CreateJokeListComponent, [
      { name: "user", value: this.user },
      { name: "lists", value: this.lists }
    ]);
  }

  deleteList(list: JokeList) {
    if (this.user) {
      this.jokeListService.deleteJokeList(list.uuid).subscribe({
        next: () => {
          if (this.user) {
            this.user.jokeLists = this.user.jokeLists.filter(l => l.id != list.id);
            this.loadLists();
            this.notificationSErvice.showNotification('Lista dowcipów została prawidłowo usunięta');
          }
        },
        error: (response) => {
          this.notificationSErvice.showNotification(response.error.error.message, NotificationType.ERROR);
        }
      })
    }
  }
}
