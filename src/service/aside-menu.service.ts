import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AsideMenuService {
  leftMenuIsShown: boolean = false;
  rightMenuIsShown: boolean = false;

  constructor(
    
  ) { }

  toggleLeftMenu(){
    this.leftMenuIsShown = !this.leftMenuIsShown;

    if(this.leftMenuIsShown){
      this.rightMenuIsShown = false;
    }
  }

  toggleRightMenu(){
    this.rightMenuIsShown = !this.rightMenuIsShown;

    if(this.rightMenuIsShown){
      this.leftMenuIsShown = false;
    }
  }
}
