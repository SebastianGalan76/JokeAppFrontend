import { Component, QueryList, ViewChildren } from '@angular/core';
import { ButtonComponent } from './button/button.component';
import { ToggleMenuButtonComponent } from './toggle-menu-button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aside-menu',
  standalone: true,
  imports: [ButtonComponent, ToggleMenuButtonComponent, CommonModule],
  templateUrl: './aside-menu.component.html',
  styleUrl: './aside-menu.component.scss'
})
export class AsideMenuComponent {
  @ViewChildren(ButtonComponent) navButtons!: QueryList<ButtonComponent>;

  isShown: boolean = false;

  handleButtonSelect(selectedButton: ButtonComponent): void {
    this.navButtons.forEach(button => {
      button.isSelected = button === selectedButton;
    });
  }

  handleToggleMenu() : void {
    this.isShown = !this.isShown;
  }
}
