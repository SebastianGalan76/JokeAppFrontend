import { Observable } from "rxjs";
import { ApiService } from "../api.service";
import { Injectable } from '@angular/core';
import { AuthenticationResponse } from "../../model/AuthenticationResponse";

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(
    private apiService: ApiService
  ) { }

  signUp(email: string, login: string, password: string): Observable<AuthenticationResponse>{
    return this.apiService.post<AuthenticationResponse>("/auth/signUp", {
      login: login,
      email: email,
      password: password
    }, {});
  }
}