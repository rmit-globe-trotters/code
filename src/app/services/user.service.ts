import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { flattenDocument } from './utils';
import { map, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {}

  async saveUserDetails({ uid, email, displayName, photoURL }: firebase.User) {
    await this.firestore
      .collection('users')
      .doc(uid)
      .set({}, { merge: true });
    return this.firestore
      .collection('users')
      .doc(uid)
      .set({ email, displayName, photoURL }, { merge: true });
  }

  getUsers() {
    return this.afAuth.authState.pipe(
      switchMap(({ uid }) =>
        this.firestore
          .collection('users')
          .snapshotChanges()
          .pipe(
            flattenDocument,
            map(users => users.filter(u => u.id !== uid))
          )
      )
    );
  }
}
