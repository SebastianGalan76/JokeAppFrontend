import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { SelectCategoryComponent } from "./select-category/select-category.component";
import { CreateJokeService } from '../../../service/joke/create-joke.service';
import { Category } from '../../../model/Category';
import { FormsModule } from '@angular/forms';
import { ResponseMessage } from '../../../model/ResponseMessage';
import { ResponseStatusEnum } from '../../../model/ResponseStatusEnum';

@Component({
  selector: 'app-add-joke',
  standalone: true,
  imports: [CommonModule, SelectCategoryComponent, FormsModule],
  templateUrl: './add-joke.component.html',
  styleUrl: './add-joke.component.scss'
})
export class AddJokeComponent {
  type: string = "JOKE";
  kind: string = "TRADITIONAL";

  selectedCategory: Category | null = null;

  jokeContent: string = '';
  jokeQuestion: string = '';
  jokeAnswer: string = '';

  responseMessage: ResponseMessage | null = null;
  buttonIsDisabled: boolean = false;

  constructor(public userService: UserService, private createJokeService: CreateJokeService) { }

  createJoke(button : HTMLButtonElement) {
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

    this.createJokeService.create(content, this.type, this.kind, this.selectedCategory).subscribe({
      next: () => {
        var typePL = this.type == "JOKE" ? 'Dowcip' : 'Suchar';

        this.responseMessage = {
          status: ResponseStatusEnum.SUCCESS,
          message: typePL + " został przesłany do weryfikacji"
        }

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

  receiveSelectedCategory(category: Category | null) {
    this.selectedCategory = category;
  }
}
