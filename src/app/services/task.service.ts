import { Injectable } from '@angular/core';
import { Task } from '../models/task.class';
import { TaskState } from '../models/task-state.enum';
import { AngularFirestore } from '@angular/fire/firestore';
import { flattenDocument } from './utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private firestore: AngularFirestore) {}

  getTasks(projectId: string): Observable<Task[]> {
    return this.firestore
      .collection('projects')
      .doc(projectId)
      .collection<Task>('tasks')
      .snapshotChanges()
      .pipe(flattenDocument);
  }

  addTask(
    projectId,
    text: string,
    description: string,
    state: TaskState,
    assignedTo: string
  ) {
    const task: Task = {
      projectId,
      text,
      description,
      state,
      assignedTo
    };
    return this.firestore
      .collection('projects')
      .doc(projectId)
      .collection('tasks')
      .add(task);
  }

  updateTask({ id, projectId, text, description, state, assignedTo }: Task) {
    return this.firestore
      .collection('projects')
      .doc(projectId)
      .collection('tasks')
      .doc(id)
      .update({
        projectId,
        text,
        description,
        state,
        assignedTo
      });
  }

  assignTask(id: string, projectId: string, assignedTo: string) {
    return this.firestore
      .collection('projects')
      .doc(projectId)
      .collection('tasks')
      .doc(id)
      .update({
        assignedTo
      });
  }

  changeState(id: string, projectId: string, state: TaskState) {
    return this.firestore
      .collection('projects')
      .doc(projectId)
      .collection('tasks')
      .doc(id)
      .update({
        state
      });
  }

  remove(id: string, projectId: string) {
    return this.firestore
      .collection('projects')
      .doc(projectId)
      .collection('tasks')
      .doc(id)
      .delete();
  }
}
