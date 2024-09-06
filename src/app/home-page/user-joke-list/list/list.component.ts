import { Component, Input } from '@angular/core';
import { JokeList } from '../../../../model/JokeList';
import { NotificationService } from '../../../../service/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  @Input({ required: true }) list!: JokeList;

  constructor(private notificationService: NotificationService, private router: Router) { }

  selectList(event: Event) {
    const target = event.target as HTMLElement;

    if (!target.closest('#favorite-button')) {
      this.router.navigate(['/list/' + this.list.uuid]);
    }
  }
}
