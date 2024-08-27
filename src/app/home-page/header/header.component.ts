import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { User } from '../../../model/User';
import { AsideMenuService } from '../../../service/aside-menu.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit{
  user: User | null = null;

  constructor (private userService: UserService, private asideMenuService: AsideMenuService){
    
  }

  ngOnInit(){
    setTimeout(() => {
      this.userService.getUser().subscribe(user => {
        if (user) {
          this.user = user;
        } else {
          this.user = null;
        }
      });
    }, 2000);
  }

  toggleLeftMenu(){
    this.asideMenuService.toggleLeftMenu();
  }
  toggleRightMenu(){
    this.asideMenuService.toggleRightMenu();
  }
}
