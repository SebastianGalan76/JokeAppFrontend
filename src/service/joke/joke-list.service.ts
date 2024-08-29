import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { PageResponse } from '../../model/PageResponse';
import { JokeDto } from '../../model/JokeDto';
import { catchError, map, Observable, of } from 'rxjs';
import { JokeList } from '../../model/JokeList';
import { User } from '../../model/User';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class JokeListService {
  constructor(private apiService: ApiService, private userService: UserService) { }

  containsJoke(list: JokeList, joke: JokeDto) {
    if (list.jokes) {
      return list.jokes.some(j => j.id === joke.id);
    }
    return false;
  }

  addJokeToList(user: User, joke: JokeDto, list: JokeList) {
    list.jokes.push(joke);
    this.apiService.post('/joke-list/' + list.id + '/' + joke.id, null, { withCredentials: true }).subscribe();
    this.userService.saveUser(user);
  }

  removeJokeFromList(user: User, joke: JokeDto, list: JokeList) {
    list.jokes = list.jokes.filter(j => j.id !== joke.id);
    this.apiService.delete('/joke-list/' + list.id + '/' + joke.id, { withCredentials: true }).subscribe();
    this.userService.saveUser(user);
  }
}
