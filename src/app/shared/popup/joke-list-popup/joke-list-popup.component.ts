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

@Component({
  selector: 'app-joke-list-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './joke-list-popup.component.html',
  styleUrls: ['./joke-list-popup.component.scss']
})
export class JokeListPopupComponent implements OnInit {
  @Input({ required: true }) joke!: JokeDto;

  public JokeListVisibilityEnum = JokeListVisibilityEnum;

  newListFormIsVisible = false;
  
  user!: User;
  jokeLists: JokeList[] = [];

  listName: string = '';
  accessibility: string = 'PUBLIC';

  constructor(private popupService: PopupService, private userService: UserService, private apiService: ApiService) { }

  ngOnInit(): void {
    this.userService.getUser().subscribe(user => {
      if (user) {
        this.user = user;
        this.jokeLists = user.jokeLists;
      }
    });
  }

  showNewListForm() {
    this.newListFormIsVisible = true;
  }

  closePopup() {
    this.popupService.closePopup();
  }

  hasJokeWithId(list: JokeList): boolean {
    if(list.jokes){
      return list.jokes.some(joke => joke.id === this.joke.id);
    }
    return false;
  }

  createNewList(){
    this.listName = '';
    this.accessibility = 'PUBLIC';

    this.apiService.post<ContentResponse<JokeList>>('/joke-list', {name: this.listName, visibilityType: this.accessibility}, {withCredentials: true}).subscribe(response => {
      if (response) {
        this.user.jokeLists.push(response.content);
        this.userService.saveUser(this.user);
      } else {
        console.log('seeeess');
      }
    });
  }

  onCheckboxChange(list: JokeList, joke: JokeDto, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const isChecked = inputElement.checked;

    const userList = this.user.jokeLists.find(userList => userList.id === list.id);

    if (isChecked && userList) {
      userList.jokes.push(joke);
      this.apiService.post('/joke-list/'+userList.id+'/'+joke.id, null, {withCredentials: true}).subscribe();

    } else if (userList) {
      userList.jokes = userList.jokes.filter(j => j.id !== joke.id);
      this.apiService.delete('/joke-list/'+userList.id+'/'+joke.id, {withCredentials: true}).subscribe();
    }

    this.userService.saveUser(this.user);
  }
}
