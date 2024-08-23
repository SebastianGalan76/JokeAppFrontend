import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aside-menu-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input({required: true}) text: string = '';
  @Input() icon: string = '';
  @Input() isSelected: boolean = false;

  @Output() onSelect = new EventEmitter<ButtonComponent>();

  select() {
    this.isSelected = true;
    this.onSelect.emit(this);
  }
}
