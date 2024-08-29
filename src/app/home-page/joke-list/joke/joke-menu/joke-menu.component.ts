import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { PopupService } from '../../../../../service/popup.service';
import { JokeListPopupComponent } from '../../../../shared/popup/joke-list-popup/joke-list-popup.component';
import { JokeDto } from '../../../../../model/JokeDto';

@Component({
  selector: 'app-joke-menu',
  standalone: true,
  imports: [],
  templateUrl: './joke-menu.component.html',
  styleUrl: './joke-menu.component.scss'
})
export class JokeMenuComponent {
  @Input({required: true}) joke!: JokeDto;

  @Output() clickOutside = new EventEmitter<null>();

  constructor(private elementRef: ElementRef, private popupService: PopupService) {}

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    
    if (!clickedInside) {
      this.handleClickOutside();
    }
  }

  handleClickOutside() {
    this.clickOutside.emit(null);
  }

  saveJokeOnList(){
    this.popupService.showPopup(JokeListPopupComponent, [
      {name: "joke", value: this.joke}
    ]);
  }
}
