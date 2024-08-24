import { Component } from '@angular/core';
import { ResponseMessage } from '../../../model/ResponseMessage';
import { ResetPasswordService } from '../../../service/auth/resetPassword.service';
import { ResponseStatusEnum } from '../../../model/ResponseStatusEnum';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(private resetPasswordService: ResetPasswordService) {
  }

  submit() {
    if (!this.isValidEmail()) {
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

  isValidEmail(): boolean {
    var trimedEmail = this.email.trim();
    if (trimedEmail.length < 4) {
      this.responseMessage = {
        status: ResponseStatusEnum.ERROR,
        message: "E-mail jest zbyt krótki"
      }

      return false;
    }
    if (trimedEmail.length > 80) {
      this.responseMessage = {
        status: ResponseStatusEnum.ERROR,
        message: "E-mail jest zbyt długi"
      }

      return false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimedEmail)) {
      this.responseMessage = {
        status: ResponseStatusEnum.ERROR,
        message: "Wprowadź poprawny adres e-mail"
      }

      return false;
    }

    return true;
  }
}
