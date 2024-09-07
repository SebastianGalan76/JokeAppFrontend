import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { JokeDto } from '../../model/JokeDto';
import { JokeList } from '../../model/JokeList';
import { UserService } from '../user.service';
import { NotificationService } from '../notification.service';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { Response } from '../../model/Response';

@Injectable({
  providedIn: 'root'
})
export class JokeListService {
  constructor(private apiService: ApiService, private userService: UserService, private notificationService: NotificationService) { }

  containsJoke(list: JokeList, joke: JokeDto) {
    if (list.jokes) {
      return list.jokes.some(j => j.id === joke.id);
    }
    return false;
  }

  addJokeToList(joke: JokeDto, list: JokeList) {
    list.jokes.push(joke);
    this.apiService.post('/joke-list/' + list.id + '/' + joke.id, null, { withCredentials: true }).subscribe();
    this.userService.saveUser();

    this.notificationService.showNotification('Dodano dowcip do listy ' + list.name);
  }

  removeJokeFromList(joke: JokeDto, list: JokeList) {
    list.jokes = list.jokes.filter(j => j.id !== joke.id);
    this.apiService.delete('/joke-list/' + list.id + '/' + joke.id, { withCredentials: true }).subscribe();
    this.userService.saveUser();
  }

  getJokeList(uuid: string): Observable<JokeList | null> {
    return this.userService.getUser().pipe(
      switchMap(user => {
        if (user) {
          const jokeList = user.jokeLists.find(list => list.uuid === uuid);
          if (jokeList) {
            return of(jokeList);
          }
        } return this.apiService.get<JokeList>('/joke-list/' + uuid, { withCredentials: true });
      }),
      catchError(error => {
        return of(null);
      })
    );
  }

}
