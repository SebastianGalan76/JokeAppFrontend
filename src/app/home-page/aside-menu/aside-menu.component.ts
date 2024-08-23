import { Component, QueryList, ViewChildren } from '@angular/core';
import { ButtonComponent } from './button/button.component';

@Component({
  selector: 'app-aside-menu',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './aside-menu.component.html',
  styleUrl: './aside-menu.component.scss'
})
export class AsideMenuComponent {
  @ViewChildren(ButtonComponent) navButtons!: QueryList<ButtonComponent>;

  handleButtonSelect(selectedButton: ButtonComponent): void {
    this.navButtons.forEach(button => {
      button.isSelected = button === selectedButton;
    });
  }
}
