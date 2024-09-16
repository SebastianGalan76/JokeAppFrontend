import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { JokeDto } from '../../model/JokeDto';
import { JokeList } from '../../model/JokeList';
import { UserService } from '../user.service';
import { NotificationService } from '../notification.service';
import { Observable } from 'rxjs';
import { Response } from '../../model/Response';
import { ContentResponse } from '../../model/ContentResponse';

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
    return this.apiService.get<JokeList>('/joke-list/' + uuid, { withCredentials: true }); 
  }

  createJokeList(name: string, visibilityType: string) : Observable<ContentResponse<JokeList>>{
    return this.apiService.post<ContentResponse<JokeList>>('/joke-list', { name: name, visibilityType: visibilityType }, { withCredentials: true });
  }

  deleteJokeList(uuid: string) : Observable<Response> {
    return this.apiService.delete('/joke-list/'+uuid, {withCredentials: true});
  }

}
