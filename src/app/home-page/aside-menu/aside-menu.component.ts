import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ButtonComponent } from './button/button.component';
import { CommonModule } from '@angular/common';
import { AsideMenuService } from '../../../service/aside-menu.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-aside-menu-left',
  standalone: true,
  imports: [ButtonComponent, CommonModule, RouterModule],
  templateUrl: './aside-menu.component.html',
  styleUrl: './aside-menu.component.scss'
})
export class AsideMenuComponent implements OnInit {
  @ViewChildren(ButtonComponent) navButtons!: QueryList<ButtonComponent>;

  path: string = '';

  constructor(public asideMenuService: AsideMenuService, private router: Router) {

  }

  ngOnInit(): void {
    this.path = this.router.url.substring(1);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.path = event.urlAfterRedirects.substring(1);
    });
  }

  handleButtonSelect(selectedButton: ButtonComponent): void {
    this.navButtons.forEach(button => {
      button.isSelected = button === selectedButton;
    });
  }

  handleToggleMenu(): void {
    this.asideMenuService.toggleLeftMenu();
  }
}
