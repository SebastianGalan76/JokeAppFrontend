import { Observable } from "rxjs";
import { ApiService } from "../api.service";
import { Injectable } from '@angular/core';
import { AuthenticationResponse } from "../../model/AuthenticationResponse";

@Injectable({
  providedIn: 'root'
})
export class SignInService {

  constructor(
    private apiService: ApiService
  ) { }

  signIn(identifier: string, password: string): Observable<AuthenticationResponse>{
    return this.apiService.post<AuthenticationResponse>("/auth/signIn", {
      identifier: identifier,
      password: password
    }, {});
  }

  activeAccount(uuid: string){
    return this.apiService.post<null>("/auth/active/"+uuid, null, {});
  }
}