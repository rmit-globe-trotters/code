import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { flattenDocument } from './utils';
import { map, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users$: Observable<User[]>;
  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {
    this.users$ = this.afAuth.authState.pipe(
      switchMap(({ uid }) =>
        this.firestore
          .collection<User>('users')
          .snapshotChanges()
          .pipe(flattenDocument)
      )
    );
  }

  getLatestUsers(): Observable<User[]> {
    return this.afAuth.authState.pipe(
      switchMap(({ uid }) =>
        this.firestore
          .collection<User>('users')
          .get()
          .pipe(map(x => x.docs.map(doc => ({ id: doc.id, ...doc.data() } as any))))
      )
    );
  }

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
}
