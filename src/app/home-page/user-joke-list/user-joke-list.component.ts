import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { FormsModule } from '@angular/forms';
import { ListComponent } from "./list/list.component";
import { JokeList } from '../../../model/JokeList';

@Component({
  selector: 'app-user-joke-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ListComponent],
  templateUrl: './user-joke-list.component.html',
  styleUrl: './user-joke-list.component.scss'
})
export class UserJokeListComponent {
  listName: string = '';
  lists: JokeList[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadLists();
  }

  loadLists() {
    this.userService.getUser().subscribe({
      next: (user) => {
        if (user?.jokeLists) {
          this.lists = user?.jokeLists.filter(list => list.name.toLocaleLowerCase().includes(this.listName.toLocaleLowerCase()));
        }
      }
    })
  }
}
