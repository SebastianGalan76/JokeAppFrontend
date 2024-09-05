import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../../../model/Category';
import { NotificationService, NotificationType } from '../../../../service/notification.service';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../../service/joke/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
  @Input({ required: true }) category!: Category;
  @Output() changeFavoriteStatus = new EventEmitter<Category>;

  constructor(private categoryService: CategoryService, private notificationService: NotificationService, private router: Router) { }

  selectCategory(event: Event) {
    const target = event.target as HTMLElement;

    if (!target.closest('#favorite-button')) {
      this.router.navigate(['/category/' + this.category.url]);
    }
  }

  favorite() {
    this.category.isFavorite = !this.category.isFavorite;

    this.categoryService.favorite(this.category.id).subscribe({
      next: () => {
        if (this.category.isFavorite) {
          this.notificationService.showNotification('Dodano kategorię do ulubionych');
        }
        else {
          this.notificationService.showNotification('Usunięto kategorię z ulubionych');
        }

        this.changeFavoriteStatus.emit(this.category);
      },
      error: (response) => {
        this.notificationService.showNotification(response.error.error.message, NotificationType.ERROR);
      }
    });
  }
}
