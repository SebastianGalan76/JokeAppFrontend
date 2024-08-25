import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AsideMenuService } from '../../../../service/aside-menu.service';
import { UserService } from '../../../../service/user.service';
import { User } from '../../../../model/User';

@Component({
  selector: 'app-aside-menu-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aside-menu.component.html',
  styleUrl: './aside-menu.component.scss'
})
export class AsideMenuComponentHeader implements OnInit{
  user: User | null = null;

  constructor(public asideMenuService: AsideMenuService, private userService: UserService){

  }

  toggleMenu() : void {
    this.asideMenuService.toggleRightMenu();
  }

  ngOnInit(){
    this.userService.getUser().subscribe(user => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }
    });
  }
}
