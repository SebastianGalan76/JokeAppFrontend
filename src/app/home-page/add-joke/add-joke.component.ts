import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { CreateJokeService } from '../../../service/joke/create-joke.service';
import { Category } from '../../../model/Category';
import { FormsModule } from '@angular/forms';
import { ResponseMessage } from '../../../model/ResponseMessage';
import { ResponseStatusEnum } from '../../../model/ResponseStatusEnum';
import { NotificationService, NotificationType } from '../../../service/notification.service';
import { PopupService } from '../../../service/popup.service';
import { SelectCategoryComponent } from '../../shared/popup/select-category/select-category.component';

@Component({
  selector: 'app-add-joke',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-joke.component.html',
  styleUrl: './add-joke.component.scss'
})
export class AddJokeComponent {
  type: string = "JOKE";
  kind: string = "TRADITIONAL";

  selectedCategories: Category[] = [];

  jokeContent: string = '';
  jokeQuestion: string = '';
  jokeAnswer: string = '';

  responseMessage: ResponseMessage | null = null;
  buttonIsDisabled: boolean = false;

  constructor(public userService: UserService, private createJokeService: CreateJokeService, private notificationService: NotificationService, private popupService: PopupService) { }

  createJoke(button: HTMLButtonElement) {
    var content = "";
    this.responseMessage = null;

    if (this.kind == "TRADITIONAL") {
      if (this.jokeContent.length < 10) {
        this.responseMessage = {
          status: ResponseStatusEnum.ERROR,
          message: "Dowcip jest zbyt krótki"
        }
        return;
      }

      content = this.jokeContent;
    }
    else {
      if (this.jokeQuestion.length < 10) {
        this.responseMessage = {
          status: ResponseStatusEnum.ERROR,
          message: "Pytanie jest zbyt krótkie"
        }
        return;
      }
      if (this.jokeQuestion.length < 2) {
        this.responseMessage = {
          status: ResponseStatusEnum.ERROR,
          message: "Odpowiedź jest zbyt krótka"
        }
        return;
      }

      content = this.jokeQuestion + '[ANSWER]' + this.jokeAnswer;
    }

    this.buttonIsDisabled = true;

    this.createJokeService.create(content, this.type, this.kind, this.selectedCategories).subscribe({
      next: () => {
        var typePL = this.type == "JOKE" ? 'Dowcip' : 'Suchar';

        this.notificationService.showNotification(typePL + " został przesłany do weryfikacji. Po zweryfikowaniu zostanie upubliczniony.", NotificationType.INFO);
        button.style.display = "none";
      },
      error: (response) => {
        var responseError = response.error;

        if (responseError) {
          this.responseMessage = {
            status: ResponseStatusEnum.ERROR,
            message: responseError.error.message
          }
        }

        this.buttonIsDisabled = false;
      },
    })
  }

  setType(value: string) {
    this.type = value;
  }

  setKind(value: string) {
    this.kind = value;
  }

  selectCategory() {
    this.popupService.showPopup(SelectCategoryComponent, [
      {
        name: "selectedCategories",
        value: this.selectedCategories
      }
    ]);
  }
}
