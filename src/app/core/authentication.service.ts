import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public onLoginStateChanged = new Subject<User>();
  
  public logout(){
    //this.afAuth.auth.signOut();
  }
}
