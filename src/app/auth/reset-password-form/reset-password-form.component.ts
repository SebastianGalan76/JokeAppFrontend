import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResponseStatusEnum } from '../../../model/ResponseStatusEnum';
import { ResponseMessage } from '../../../model/ResponseMessage';
import { ResetPasswordService } from '../../../service/auth/resetPassword.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../service/auth/auth.service';
import { NotificationService } from '../../../service/notification.service';

@Component({
  selector: 'app-reset-password-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password-form.component.html',
  styleUrl: '../form.component.scss'
})
export class ResetPasswordFormComponent {
  password: string = '';
  passwordConfirm: string = '';

  token: string = '';

  responseMessage: ResponseMessage | null = null;
  buttonIsDisabled: boolean = false;

  constructor(private resetPasswordService: ResetPasswordService, private authService: AuthService, private activeRoute: ActivatedRoute, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  submit() {
    this.responseMessage = this.authService.isValidPassword(this.password);
    if (this.responseMessage.status == ResponseStatusEnum.ERROR) {
      return;
    }
    this.responseMessage = this.authService.isValidPasswordConfirm(this.password, this.passwordConfirm);
    if (this.responseMessage.status == ResponseStatusEnum.ERROR) {
      return;
    }

    this.buttonIsDisabled = true;
    this.responseMessage = null;

    this.resetPasswordService.resetPassword(this.password, this.token)
      .subscribe(
        {
          next: () => {
            this.notificationService.showNotification("Twoje hasło zostało zmienione. Możesz się zalogować");
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
