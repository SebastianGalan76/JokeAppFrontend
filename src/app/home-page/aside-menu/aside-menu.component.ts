import { Component, QueryList, ViewChildren } from '@angular/core';
import { ButtonComponent } from './button/button.component';
import { CommonModule } from '@angular/common';
import { AsideMenuService } from '../../../service/aside-menu.service';

@Component({
  selector: 'app-aside-menu-left',
  standalone: true,
  imports: [ButtonComponent, CommonModule],
  templateUrl: './aside-menu.component.html',
  styleUrl: './aside-menu.component.scss'
})
export class AsideMenuComponent {
  @ViewChildren(ButtonComponent) navButtons!: QueryList<ButtonComponent>;

  constructor(public asideMenuService: AsideMenuService){

  }

  handleButtonSelect(selectedButton: ButtonComponent): void {
    this.navButtons.forEach(button => {
      button.isSelected = button === selectedButton;
    });
  }

  handleToggleMenu() : void {
    this.asideMenuService.toggleLeftMenu();
  }
}
