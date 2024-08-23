import { Component } from '@angular/core';
import { AsideMenuComponent } from "./aside-menu/aside-menu.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  imports: [AsideMenuComponent]
})
export class HomePageComponent {

}
