import { Injectable } from '@angular/core';
import { Project } from '../models/project.class';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { flattenDocument } from './utils';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private collectionName = 'projects';
  projects$: Observable<Project[]>;

  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {}

  getProjects() {
    return this.afAuth.authState.pipe(
      switchMap(user =>
        this.firestore
          .collection<Project>(this.collectionName, ref => ref.where('creator', '==', user.uid))
          .snapshotChanges()
          .pipe(flattenDocument)
      )
    );
  }

  addProject({ name, description, members }: Project) {
    return this.afAuth.authState.subscribe(({ uid }) => {
      return this.firestore
        .collection<Project>(this.collectionName, ref => ref.where('creator', '==', uid))
        .add({ name, description, creator: uid, members });
    });
  }

  getProject(id: any) {
    return this.firestore
      .collection<Project>(this.collectionName)
      .doc(id)
      .get()
      .pipe(map(doc => ({ id, ...doc.data() } as Project)));
  }
}
