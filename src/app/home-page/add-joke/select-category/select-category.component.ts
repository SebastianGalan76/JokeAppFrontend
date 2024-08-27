import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { CategoryService } from '../../../../service/joke/category.service';
import { Category } from '../../../../model/Category';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-category.component.html',
  styleUrls: ['./select-category.component.scss', '../../../../styles/formElement.scss']
})
export class SelectCategoryComponent {
  @Output() categoryEmitter = new EventEmitter<Category | null>();
  
  isFocused: boolean = false;

  categories: Category[] = [];
  populatedCategories: Category[] = [];

  selectedCategory: Category | null = null;
  inputValue: string = '';

  constructor(private categoryService: CategoryService) {
    this.loadCategories();
  }

  selectCategory(category: Category) {
    this.selectedCategory = category;
    this.inputValue = category.name;

    this.isFocused = false;
    this.categoryEmitter.emit(this.selectedCategory);
  }

  onInputChange() {
    if (this.categories) {
      this.populatedCategories = this.categories.filter(category =>
        category.name.toLowerCase().includes(this.inputValue.toLowerCase())
      );
    } else {
      this.populatedCategories = [];
    }
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
      this.populatedCategories = categories;
    })
  }

  onFocus(){
    this.isFocused = true;
    this.onInputChange();
  }

  onBlur() {
    setTimeout(() => {
      this.isFocused = false;
    }, 100);
  }
}
