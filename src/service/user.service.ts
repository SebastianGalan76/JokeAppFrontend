import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { User } from '../model/User';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: User | null = null;

  constructor(
    private apiService: ApiService,
  ) { }

  getUser(): Observable<User | null> {
    if(this.user){
      return of(this.user);
    }

    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      if(CookieService.isJwtTokenExpired()){
        sessionStorage.removeItem('user');
        return of(null);
      }

      this.user = JSON.parse(storedUser);
      return of(this.user);
    }
    return this.apiService.get<User | null>("/user", { withCredentials: true }).pipe(
      map(data => {
        if (data) {
          this.user = new User(data.id, data.login, data.email, data.role, data.jokeLists);
          this.saveUser();
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

  saveUser(){
    sessionStorage.setItem('user', JSON.stringify(this.user));
  }

  logout(){
    localStorage.removeItem('user');
  }
}
