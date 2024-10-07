import { Component } from '@angular/core';
import { SignUpService } from '../../../service/auth/signUp.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ResponseMessage } from '../../../model/ResponseMessage';
import { ResponseStatusEnum } from '../../../model/ResponseStatusEnum';
import { AuthService } from '../../../service/auth/auth.service';
import { NotificationService } from '../../../service/notification.service';

@Component({
  selector: 'app-sign-up-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sign-up-form.component.html',
  styleUrl: '../form.component.scss'
})
export class SignUpFormComponent {
  login: string = '';
  email: string = '';
  password: string = '';
  passwordConfirm: string = '';

  responseMessage: ResponseMessage | null = null;
  buttonIsDisabled: boolean = false;

  constructor(private signUpService: SignUpService, private authService: AuthService, private notificationService: NotificationService) {

  }

  submit() {
    this.responseMessage = this.authService.isValidLogin(this.login);
    if (this.responseMessage.status == ResponseStatusEnum.ERROR) {
      return;
    }
    this.responseMessage = this.authService.isValidPassword(this.password);
    if (this.responseMessage.status == ResponseStatusEnum.ERROR) {
      return;
    }
    this.responseMessage = this.authService.isValidPasswordConfirm(this.password, this.passwordConfirm);
    if (this.responseMessage.status == ResponseStatusEnum.ERROR) {
      return;
    }
    this.responseMessage = this.authService.isValidEmail(this.email);
    if (this.responseMessage.status == ResponseStatusEnum.ERROR) {
      return;
    }

    this.buttonIsDisabled = true;
    this.responseMessage = null;

    this.signUpService.signUp(this.email, this.login, this.password)
      .subscribe(
        {
          next: () => {
            this.notificationService.showNotification("Link aktywacyjny konta został wysłany na podany adres e-mail");
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
}
