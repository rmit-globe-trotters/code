import { Injectable } from '@angular/core';
import { Project } from '../models/project.class';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
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
      switchMap(({ uid }) =>
        this.firestore
          .collection<Project>(this.collectionName, ref =>
            ref.where('members', 'array-contains', uid)
          )
          .snapshotChanges()
          .pipe(flattenDocument)
      ),
      catchError(error => {
        console.error(error);
        return [];
      })
    );
  }

  addProject({ name, description, members }: Project) {
    return this.afAuth.authState.pipe(
      map(({ uid }) =>
        this.firestore.collection<Project>(this.collectionName).add({
          name,
          description,
          creator: uid,
          members: [uid, ...members],
          createdAt: new Date()
        })
      )
    );
  }

  getProject(id: any) {
    return this.firestore
      .collection<Project>(this.collectionName)
      .doc(id)
      .get()
      .pipe(map(doc => ({ id, ...doc.data() } as Project)));
  }
}
