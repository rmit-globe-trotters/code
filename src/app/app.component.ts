import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'code';
  loggedIn: boolean;

  loginSuccess(value){
    this.loggedIn = true;
  }

  loginFailure(value){
    this.loggedIn = false;
  }
}
