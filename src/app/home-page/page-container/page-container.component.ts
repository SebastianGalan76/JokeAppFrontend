import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { PageResponse } from '../../../model/PageResponse';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-container.component.html',
  styleUrl: './page-container.component.scss'
})
export class PageContainerComponent {
  @Output() changePageEvent = new EventEmitter<number>();

  pageResponse: PageResponse<any> | null = null;
  currentPage: number = 0;

  @ViewChild('pageContainer', { read: ViewContainerRef }) pageContainer!: ViewContainerRef;
  @ViewChild('pageTemplate', { read: TemplateRef }) pageTemplate!: TemplateRef<any>;
  @ViewChild('dividerTemplate', { read: TemplateRef }) dividerTemplate!: TemplateRef<any>;

  initialize(pageResponse: PageResponse<any> | null){
    this.pageResponse = pageResponse;

    this.generatePages();
  }

  generatePages(): void {
    this.pageContainer.clear();

    if(!this.pageResponse){
      return;
    }
    const totalPages = this.pageResponse.content.totalPages - 1;
    if (totalPages < 1) {
      return;
    }

    if (totalPages <= 5) {
      for (var i = 0; i <= totalPages; i++) {
        this.createPageElement(i);
      }
    } else {
      if (this.currentPage >= 3) {
        this.createPageElement(0);
        this.createDividerElement();
      }

      for (var i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
        if (i >= 0 && i <= totalPages) {
          this.createPageElement(i);
        }
      }

      if (this.currentPage <= totalPages - 3) {
        this.createDividerElement();
        this.createPageElement(totalPages);
      }
    }
  }

  createPageElement(pageNumber: number): void {
    const context = {
      $implicit: pageNumber,
      isSelected: pageNumber === this.currentPage
    };

    this.pageContainer.createEmbeddedView(this.pageTemplate, context);
  }

  createDividerElement(): void {
    this.pageContainer.createEmbeddedView(this.dividerTemplate);
  }

  changePage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.generatePages();
    this.changePageEvent.emit(this.currentPage);
  }
}
