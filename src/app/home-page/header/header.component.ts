import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { User } from '../../../model/User';
import { AsideMenuService } from '../../../service/aside-menu.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit{
  user: User | null = null;

  constructor (private userService: UserService, private asideMenuService: AsideMenuService){
    
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

  toggleLeftMenu(){
    this.asideMenuService.toggleLeftMenu();
  }
  toggleRightMenu(){
    this.asideMenuService.toggleRightMenu();
  }
}
