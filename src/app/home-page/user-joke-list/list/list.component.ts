import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JokeList, JokeListVisibilityEnum } from '../../../../model/JokeList';
import { NotificationService } from '../../../../service/notification.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  @Input({ required: true }) list!: JokeList;
  @Output() onDelete = new EventEmitter<JokeList>();

  public JokeListVisibilityEnum = JokeListVisibilityEnum;

  constructor(private notificationService: NotificationService, private router: Router) { }

  selectList(event: Event) {
    const target = event.target as HTMLElement;

    if (!target.closest('i')) {
      this.router.navigate(['/list/' + this.list.uuid]);
    }
  }

  deleteList(){
    this.onDelete.emit(this.list);
  }

  editList(){

  }
}
