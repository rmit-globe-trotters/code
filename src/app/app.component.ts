import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Globetrotters';
  loggedInUser: User;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'modal-open');
  }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      this.setBodyClass(user);
      this.loggedInUser = user;
    });
  }

  logout() {
    this.setBodyClass(null);
    this.loggedInUser = null;
    this.afAuth.auth.signOut();
    this.router.navigate(['login']);
  }

  setBodyClass(user: User) {
    const backgroundClass = 'bg-dark';
    if (user) {
      this.renderer.removeClass(document.body, backgroundClass);
    } else {
      this.renderer.addClass(document.body, backgroundClass);
    }
  }
}
