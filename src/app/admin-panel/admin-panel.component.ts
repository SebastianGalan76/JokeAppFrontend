import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '../../service/user.service';
import { UserRoleEnum } from '../../model/User';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) {

  }
  ngOnInit(): void {
    this.userService.getUser().subscribe({
      next: (user) => {
        
        if (user) {
          const roleName = user.role as unknown as keyof typeof UserRoleEnum;
          const roleValue = UserRoleEnum[roleName];

          if(roleValue>=500){
            return;
          }
        }
        this.router.navigate(['/']);
      }
    })
  }


}
