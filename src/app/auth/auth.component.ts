import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignInFormComponent } from "./sign-in-form/sign-in-form.component";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterOutlet, SignInFormComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

}
