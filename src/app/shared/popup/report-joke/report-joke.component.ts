import { Component, Input } from '@angular/core';
import { JokeDto } from '../../../../model/JokeDto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PopupService } from '../../../../service/popup.service';
import { ApiService } from '../../../../service/api.service';
import { NotificationService, NotificationType } from '../../../../service/notification.service';

@Component({
  selector: 'app-report-joke',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-joke.component.html',
  styleUrl: './report-joke.component.scss'
})
export class ReportJokeComponent {
  @Input() joke!: JokeDto;
  selectedReason: number = 0;

  options: { value: number, label: string }[] = [
    {value: 2, label: "Nieodpowiedni dla dzieci"},
    {value: 3, label: "Treści rasistowskie"},
    {value: 4, label: "Treści homofobiczne"},
    {value: 5, label: "Treści religijne"},
    {value: 6, label: "Treści wulgarne"},
    {value: 0, label: "Inny"},
  ];

  textAreaReason: string = '';

  constructor(private apiService: ApiService, private popupService: PopupService, private notificationService: NotificationService) {}

  sendReport(){
    var reason = '';
    if(this.selectedReason == 0){
      reason = this.textAreaReason;
      if(reason.length < 10){
        this.notificationService.showNotification('Powód jest zbyt krótki', NotificationType.ERROR);
        return;
      }
    }
    else{
      reason = this.options.find(option => option.value == this.selectedReason)!.label;
    }

    this.apiService.post('/joke/'+this.joke.id+"/report", reason, {withCredentials: true}).subscribe({
      next: () => {
        this.notificationService.showNotification('Dowcip został zgłoszony');
        this.closePopup();
      },
      error: (response) => {
        this.notificationService.showNotification(response.error.error.message, NotificationType.ERROR);
      }
    });
  }

  closePopup(){
    this.popupService.closePopup();
  }
}
