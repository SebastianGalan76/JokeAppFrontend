import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResponseStatusEnum } from '../../../model/ResponseStatusEnum';
import { ResponseMessage } from '../../../model/ResponseMessage';
import { ResetPasswordService } from '../../../service/auth/resetPassword.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(private resetPasswordService: ResetPasswordService, private activeRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  submit() {
    if (!this.isValidPassword()) {
      return;
    }

    this.buttonIsDisabled = true;
    this.responseMessage = null;

    this.resetPasswordService.resetPassword(this.password, this.token)
      .subscribe(
        {
          next: () => {
            this.responseMessage = {
              status: ResponseStatusEnum.SUCCESS,
              message: "Twoje hasło zostało zmienione. Możesz się zalogować"
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

  isValidPassword(): boolean {
    var trimedPassword = this.password.trim();

    if (trimedPassword.length < 4) {
      this.responseMessage = {
        status: ResponseStatusEnum.ERROR,
        message: "Hasło jest zbyt krótkie"
      }

      return false;
    }

    if (trimedPassword != this.passwordConfirm) {
      this.responseMessage = {
        status: ResponseStatusEnum.ERROR,
        message: "Hasła nie są identyczne"
      }
      return false;
    }

    return true;
  }
}
