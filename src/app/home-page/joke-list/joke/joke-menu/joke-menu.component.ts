import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-joke-menu',
  standalone: true,
  imports: [],
  templateUrl: './joke-menu.component.html',
  styleUrl: './joke-menu.component.scss'
})
export class JokeMenuComponent {
  @Output() clickOutside = new EventEmitter<null>();

  constructor(private elementRef: ElementRef) {}

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
}
