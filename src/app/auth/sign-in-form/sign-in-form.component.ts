import { Component } from '@angular/core';
import { ResponseMessage } from '../../../model/ResponseMessage';
import { SignInService } from '../../../service/auth/signIn.service';
import { ResponseStatusEnum } from '../../../model/ResponseStatusEnum';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private signInService: SignInService, private router: Router) {
  }

  submit() {
    if (!this.isValidIdentifier()) {
      return;
    }
    if (!this.isValidPassword()) {
      return;
    }

    this.buttonIsDisabled = true;
    this.responseMessage = null;

    this.signInService.signIn(this.identifier, this.password)
      .subscribe(
        {
          next: () => {
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

  isValidPassword(): boolean {
    var trimedPassword = this.password.trim();

    if (trimedPassword.length < 4) {
      this.responseMessage = {
        status: ResponseStatusEnum.ERROR,
        message: "Hasło jest zbyt krótkie"
      }

      return false;
    }

    return true;
  }
}
