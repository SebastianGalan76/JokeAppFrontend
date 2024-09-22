import { Component } from '@angular/core';
import { ResponseMessage } from '../../../model/ResponseMessage';
import { SignInService } from '../../../service/auth/signIn.service';
import { ResponseStatusEnum } from '../../../model/ResponseStatusEnum';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from '../../../service/cookie.service';
import { AuthService } from '../../../service/auth/auth.service';
import { NotificationService } from '../../../service/notification.service';

@Component({
  selector: 'app-sign-in-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sign-in-form.component.html',
  styleUrl: '../form.component.scss'
})
export class SignInFormComponent {
  identifier: string = '';
  password: string = '';

  responseMessage: ResponseMessage | null = null;
  buttonIsDisabled: boolean = false;

  constructor(private signInService: SignInService, private authService: AuthService, private router: Router, private route: ActivatedRoute, private notificationService: NotificationService) {
    var uuid = this.route.snapshot.paramMap.get('uuid');
    if(uuid){
      signInService.activeAccount(uuid).subscribe();
      notificationService.showNotification('Twoje konto zostało aktywowane. Możesz się zalogować');
    }
  }

  submit() {
    if (!this.isValidIdentifier()) {
      return;
    }
    if (this.authService.isValidPassword(this.password).status == ResponseStatusEnum.ERROR) {
      return;
    }

    this.buttonIsDisabled = true;
    this.responseMessage = null;

    this.signInService.signIn(this.identifier, this.password)
      .subscribe(
        {
          next: (response) => {
            CookieService.setCookie('jwt_token', response.jwtToken, 30);
            
            this.router.navigate(['/']);
          },
          error: (response) => {
            var responseError = response.error;

            if (responseError) {
              this.responseMessage = {
                status: ResponseStatusEnum.ERROR,
                message: responseError.error.message
              }
            }

            this.buttonIsDisabled = false;
          },
        }
      );
  }

  isValidIdentifier(): boolean {
    var trimedLogin = this.identifier.trim();
    if (trimedLogin.length < 4) {
      this.responseMessage = {
        status: ResponseStatusEnum.ERROR,
        message: "Login jest zbyt krótki"
      }

      return false;
    }

    return true;
  }
}
