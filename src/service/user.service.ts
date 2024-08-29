import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { User } from '../model/User';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: User | null = null;

  constructor(
    private apiService: ApiService
  ) { }

  getUser(): Observable<User | null> {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      return of(this.user);
    }

    return this.apiService.get<User | null>("/user", { withCredentials: true }).pipe(
      map(data => {
        if (data) {
          this.user = new User(data.login, data.email, data.role, data.jokeLists);
          this.saveUser(this.user);
          return this.user;
        } else {
          this.user = null;
          return null;
        }
      }),
      catchError(error => {
        console.error('Błąd pobierania użytkownika', error);
        return of(null);
      })
    );
  }

  saveUser(user: User){
    sessionStorage.setItem('user', JSON.stringify(this.user));
  }

  logout(){
    localStorage.removeItem('user');
  }
}
