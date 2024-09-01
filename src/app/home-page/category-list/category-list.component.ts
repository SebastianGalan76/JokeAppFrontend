import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../service/joke/category.service';
import { Category } from '../../../model/Category';
import { CategoryComponent } from "./category/category.component";

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CategoryComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {
  categoryName: string = '';

  favoriteCategories: Category[] = [];
  categories: Category[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        if (this.categoryName.length > 0) {
          categories = categories.filter(category => category.name.toLocaleLowerCase().includes(this.categoryName.toLocaleLowerCase()));
        }

        this.categories = categories;
        this.favoriteCategories = this.categories.filter(category => category.isFavorite);
      }
    })
  }

  changeFavoriteStatus(category: Category) {
    if (category.isFavorite) {
      this.favoriteCategories.push(category);
    }
    else {
      this.favoriteCategories = this.favoriteCategories.filter(favoriteCategory => favoriteCategory.id != category.id);
    }
  }
}
