import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PopupComponent } from "./shared/popup/popup.component";
import { NotificationComponent } from "./shared/notification/notification.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PopupComponent, NotificationComponent],
  template: `
  <app-notification />
  <app-popup />
    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  title = 'JokeAppFrontend';
}
