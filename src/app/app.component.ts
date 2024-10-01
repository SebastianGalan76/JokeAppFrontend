import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
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
  title = 'Dawka Śmiechu - Najlepsze dowcipy, żarty i suchary';

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }
}
