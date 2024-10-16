import { Component } from '@angular/core';
import { AsideMenuComponent } from "./aside-menu/aside-menu.component";
import { HeaderComponent } from "./header/header.component";
import { AsideMenuComponentHeader } from "./header/aside-menu/aside-menu.component";
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./footer/footer.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  imports: [AsideMenuComponent, HeaderComponent, AsideMenuComponentHeader, RouterOutlet, FooterComponent]
})
export class HomePageComponent {

}
