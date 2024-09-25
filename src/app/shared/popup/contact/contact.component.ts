import { Component } from '@angular/core';
import { PopupService } from '../../../../service/popup.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

  constructor(private popupService: PopupService) {
    
  }

closePopup() {
  this.popupService.closePopup();
}

}
