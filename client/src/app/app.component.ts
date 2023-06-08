import { Component } from '@angular/core';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public title = 'RevanFY';
  public user: User;
  public identity: any; 
  public token: any;
  
  constructor(){
    this.user = new User('','','','','','ROLE_USER', '');
    //this.identity = true;
  }

  public onSubmit(){
    console.log(this.user);
  }
}
