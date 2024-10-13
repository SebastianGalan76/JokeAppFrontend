import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Category } from '../../../model/Category';
import { ResponseMessage } from '../../../model/ResponseMessage';
import { UserService } from '../../../service/user.service';
import { CreateJokeService } from '../../../service/joke/create-joke.service';
import { NotificationService, NotificationType } from '../../../service/notification.service';
import { PopupService } from '../../../service/popup.service';
import { ResponseStatusEnum } from '../../../model/ResponseStatusEnum';
import { SelectCategoryComponent } from '../../shared/popup/select-category/select-category.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { JokeDto } from '../../../model/JokeDto';
import { EditJokeService } from '../../../service/joke/edit-joke.service';
import { JokeService } from '../../../service/joke/joke.service';

@Component({
  selector: 'app-edit-joke',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-joke.component.html',
  styleUrl: './edit-joke.component.scss'
})
export class EditJokeComponent implements OnInit {
  @Input() joke: JokeDto | null;

  jokeContent: string = '';
  jokeQuestion: string = '';
  jokeAnswer: string = '';

  responseMessage: ResponseMessage | null = null;
  buttonIsDisabled: boolean = false;

  constructor(
    public userService: UserService,
    private jokeService: JokeService,
    private editJokeService: EditJokeService,
    private notificationService: NotificationService,
    private popupService: PopupService,
    private router: Router,
    private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    this.joke = navigation?.extras.state?.['joke'];
  }

  ngOnInit(): void {
    if(!this.joke){
      const jokeId = parseInt(this.route.snapshot.paramMap.get('id')!);

      this.jokeService.getById(jokeId).subscribe({
        next: (joke) => {
          this.loadJoke(joke);
        },
        error: () => {
          this.notificationService.showNotification("Niepoprawny identyfikator dowcipu", NotificationType.ERROR);
        }
      })
    }
    else{
      this.loadJoke(this.joke);
    }
  }

  editJoke(button: HTMLButtonElement) {
    var content = "";
    this.responseMessage = null;

    if (!this.joke) {
      return;
    }

    if (this.joke.kind == "TRADITIONAL") {
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

    this.editJokeService.edit(this.joke.id, content, this.joke.type, this.joke.kind, this.joke.categories).subscribe({
      next: () => {
        if (!this.joke) {
          return;
        }

        var typePL = this.joke.type == "JOKE" ? 'Dowcip' : 'Suchar';

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
    if (this.joke) {
      this.joke.type = value;
    }

  }

  setKind(value: string) {
    if (this.joke) {
      this.joke.kind = value;
    }

  }

  selectCategory() {
    if (this.joke) {
      this.popupService.showPopup(SelectCategoryComponent, [
        {
          name: "selectedCategories",
          value: this.joke.categories
        }
      ]);
    }
  }

  loadJoke(joke: JokeDto | null){
    this.joke = joke;

    if (this.joke) {
      if (this.joke.kind == 'TRADITIONAL') {
        this.jokeContent = this.joke.content;
      }
      else {
        var content = this.joke.content.split('[ANSWER]');

        if (content.length == 2) {
          this.jokeQuestion = content[0];
          this.jokeAnswer = content[1];
        }
      }
    }
  }
}
