import { Component } from '@angular/core';
import { ResponseMessage } from '../../../model/ResponseMessage';
import { ResetPasswordService } from '../../../service/auth/resetPassword.service';
import { ResponseStatusEnum } from '../../../model/ResponseStatusEnum';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../service/auth/auth.service';

@Component({
  selector: 'app-reset-password-require-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password-require-form.component.html',
  styleUrl: '../form.component.scss'
})
export class ResetPasswordRequireFormComponent {
  email: string = '';

  responseMessage: ResponseMessage | null = null;
  buttonIsDisabled: boolean = false;

  constructor(private resetPasswordService: ResetPasswordService, private authService: AuthService) {
  }

  submit() {
    if (this.authService.isValidEmail(this.email).status == ResponseStatusEnum.ERROR) {
      return;
    }

    this.buttonIsDisabled = true;
    this.responseMessage = null;

    this.resetPasswordService.requireResetPassword(this.email)
      .subscribe(
        {
          next: () => {
            this.responseMessage = {
              status: ResponseStatusEnum.SUCCESS,
              message: "Jeśli konto istnieje, to wyślemy na adres e-mail link do zmiany hasła"
            }
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
