import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-menu-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="toggle-menu-button" (click)="toggleMenu()">
        <i [ngClass]="icon"></i>
    </div>
  `,
  styles: `
    #toggle-menu-button {
        position: absolute;
        right: 12px;
        top: 10px;

        color: #646464;

        width: 30px;
        height: 30px;

        display: none;
        align-items: center;
        justify-content: center;

        font-size: 1.2em;
        font-weight: 500;

        flex-shrink: 0;
    }

    @media (max-width: 600px) {
        #toggle-menu-button{
            display: flex;
        }
    }
  `,
})
export class ToggleMenuButtonComponent {
  private _isShown: boolean = false;
  @Input()
  set isShown(value: boolean) {
    this._isShown = value;
    this.changeIcon();
  }
  get isShown(): boolean {
    return this._isShown;
  }

  @Output() clickButton = new EventEmitter<void>();

  icon: string = "fa-solid fa-square-caret-right";

  toggleMenu() {
    this.clickButton.emit();

    this.isShown = !this.isShown;
    this.changeIcon();
  }

  changeIcon() {
    if (this.isShown) {
      this.icon = "fa-solid fa-square-caret-left";
    }
    else {
      this.icon = "fa-solid fa-square-caret-right";
    }
  }
}
