import { Observable } from "rxjs";
import { ApiService } from "../api.service";
import { Injectable } from '@angular/core';
import { AuthenticationResponse } from "../../model/AuthenticationResponse";

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(
    private apiService: ApiService
  ) { }

  requireResetPassword(email: string): Observable<AuthenticationResponse>{
    return this.apiService.post<AuthenticationResponse>("/auth/requireResetPassword", email, {});
  }

  resetPassword(newPassword: string, token: string): Observable<AuthenticationResponse>{
    return this.apiService.post<AuthenticationResponse>("/auth/resetPassword", 
      {
        newPassword: newPassword,
        token: token
      }
      , {});
  }
}