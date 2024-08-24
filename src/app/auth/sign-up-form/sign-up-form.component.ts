import { Component } from '@angular/core';
import { SignUpService } from '../../../service/auth/signUp.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ResponseMessage } from '../../../model/ResponseMessage';
import { ResponseStatusEnum } from '../../../model/ResponseStatusEnum';

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

  constructor(private signUpService: SignUpService) {

  }

  submit() {
    if (!this.isValidLogin()) {
      return;
    }
    if (!this.isValidPassword()) {
      return;
    }
    if (!this.isValidEmail()) {
      return;
    }

    this.buttonIsDisabled = true;
    this.responseMessage = null;

    this.signUpService.signUp(this.email, this.login, this.password)
      .subscribe(
        {
          next: () => {
            this.responseMessage = {
              status: ResponseStatusEnum.SUCCESS,
              message: "Link aktywacyjny konta został wysłany na podany adres e-mail"
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

  isValidLogin(): boolean {
    var trimedLogin = this.login.trim();
    if (trimedLogin.length < 4) {
      this.responseMessage = {
        status: ResponseStatusEnum.ERROR,
        message: "Login jest zbyt krótki"
      }

      return false;
    }
    if (trimedLogin.length > 30) {
      this.responseMessage = {
        status: ResponseStatusEnum.ERROR,
        message: "Login jest zbyt długi"
      }

      return false;
    }

    return true;
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
