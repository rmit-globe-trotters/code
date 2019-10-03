import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  error: any;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  loginSuccess(value) {
    this.router.navigateByUrl('/');
  }

  loginFailure(error) {
    this.error = error;
  }
}
