import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AsideMenuService } from '../../../../service/aside-menu.service';

@Component({
  selector: 'app-aside-menu-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aside-menu.component.html',
  styleUrl: './aside-menu.component.scss'
})
export class AsideMenuComponentHeader {
  constructor(public asideMenuService: AsideMenuService){

  }

  toggleMenu() : void {
    this.asideMenuService.toggleRightMenu();
  }
}
