import { AfterViewInit, Component, Input, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Category } from '../../../../model/Category';
import { CategoryService } from '../../../../service/joke/category.service';
import { FormsModule } from '@angular/forms';
import { PopupService } from '../../../../service/popup.service';

class CategoryElement{
  category!: Category;
  isSelected!: boolean;
}

@Component({
  selector: 'app-select-category',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './select-category.component.html',
  styleUrl: './select-category.component.scss'
})
export class SelectCategoryComponent implements AfterViewInit {
  @Input() selectedCategories: Category[] = [];

  @ViewChild('categoryContainer', { read: ViewContainerRef }) categoryContainer!: ViewContainerRef;
  @ViewChild('categoryTemplate', { read: TemplateRef }) categoryTemplate!: TemplateRef<any>;

  nameInput: string = '';
  categories: Category[] = [];

  categoryElements: CategoryElement[] = [];

  constructor(private categoryService: CategoryService, private popupService: PopupService) { }

  ngAfterViewInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.populateContainer();
      }
    });
  }

  selectCategory(categoryElement: CategoryElement) {
    const index = this.selectedCategories.findIndex(c => c.id === categoryElement.category.id);

    if (index !== -1) {
      this.selectedCategories.splice(index, 1);
      categoryElement.isSelected = false;
    }
    else{
      this.selectedCategories.push(categoryElement.category);
      categoryElement.isSelected = true;
    }
  }

  populateContainer() {
    this.categoryContainer.clear();

    this.categories.forEach(category => {
      if(category.name.toLocaleLowerCase().includes(this.nameInput.toLowerCase())){
        this.createCategoryElement(category);
      }
    });
  }

  createCategoryElement(category: Category): void {
    const index = this.selectedCategories.findIndex(c => c.id == category.id);

    const element = {
      category: category,
      isSelected: index >= 0
    }

    const context = {
      element: element
    };

    this.categoryElements.push(element);

    this.categoryContainer.createEmbeddedView(this.categoryTemplate, context);
  }

  close(){
    this.popupService.closePopup();
  }
}
