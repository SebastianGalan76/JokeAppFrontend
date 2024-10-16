import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { PopupService } from '../../../../../service/popup.service';
import { JokeListPopupComponent } from '../../../../shared/popup/joke-list-popup/joke-list-popup.component';
import { JokeDto } from '../../../../../model/JokeDto';
import { UserService } from '../../../../../service/user.service';
import { NotificationService, NotificationType } from '../../../../../service/notification.service';
import { CommonModule } from '@angular/common';
import { User, UserRoleEnum } from '../../../../../model/User';
import { JokeContainerService } from '../../../../../service/joke/joke-container.service';
import { ReportJokeComponent } from '../../../../shared/popup/report-joke/report-joke.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-joke-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './joke-menu.component.html',
  styleUrl: './joke-menu.component.scss'
})
export class JokeMenuComponent implements OnInit {
  @Input({ required: true }) joke!: JokeDto;

  @Output() clickOutside = new EventEmitter<null>();

  user: User | null = null;
  userRole = UserRoleEnum;

  constructor(private elementRef: ElementRef, private popupService: PopupService, private userService: UserService, private notificationService: NotificationService, private jokeContainerService: JokeContainerService, private router: Router) { }

  ngOnInit(): void {
    this.userService.getUser().subscribe({
      next: (user) => {
        this.user = user;
      }
    })
  }

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

  saveJokeOnList() {
    this.userService.getUser().subscribe({
      next: (user) => {
        if (user == null) {
          this.notificationService.showNotification('Musisz być zalogowany, aby dodać dowcip do własnej listy', NotificationType.ERROR);
        }
        else {
          this.popupService.showPopup(JokeListPopupComponent, [
            { name: "joke", value: this.joke }
          ]);
        }
      }
    })
  }

  editJoke() {
    this.router.navigate(['/edit', this.joke.id], {
      state: {
        joke: this.joke
      }
    });
  }

  deleteJoke() {
    this.popupService.showConfirmPopup([{ name: 'message', value: 'Czy na pewno chcesz usunąć ten dowcip?' }]).subscribe(result => {
      if (result.event === 'confirm') {
        this.jokeContainerService.deleteJoke(this.joke);
      }
    });
  }

  reportJoke() {
    this.popupService.showPopup(ReportJokeComponent, [
      { name: "joke", value: this.joke }
    ])
  }
}
