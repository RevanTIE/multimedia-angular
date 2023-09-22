import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]

})
export class AppComponent implements OnInit {
  public title = 'RevanFY';
  public user: User;
  public identity: any; 
  public token: any;
  public errorMessage; 
  
  constructor(
    private _userService: UserService
    ){
    this.user = new User('','','','','','ROLE_USER', '');
    //this.identity = true;
  }

  ngOnInit()
  {
   
  }

  public onSubmit(){
    console.log(this.user);

    this._userService.signup(this.user).subscribe(
      response =>{
        console.log(response);
      },
      error => {
        var errorMessage = <any>error;
        if(errorMessage != null){
          let body = JSON.stringify(error._body);
          let parse_body = JSON.parse(body);
          this.errorMessage = parse_body.message;
          console.log(error);
        }
      }
    );
  }
}
