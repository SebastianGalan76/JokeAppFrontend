import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PopupComponent } from "./shared/popup/popup.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PopupComponent],
  template: `
  <app-popup />
    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  title = 'JokeAppFrontend';
}
