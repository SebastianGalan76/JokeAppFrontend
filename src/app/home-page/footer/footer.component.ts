import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PopupService } from '../../../service/popup.service';
import { ContactComponent } from '../../shared/popup/contact/contact.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  constructor(private popupService:PopupService){

  }

  showContactPopup(){
    this.popupService.showPopup(ContactComponent, []);
  }
}
