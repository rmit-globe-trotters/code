import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Team } from '../models/team.class';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  collectionName = 'teams'

  constructor(private firestore: AngularFirestore) { }

  addTeam(team: Team) {
    return this.firestore.collection(this.collectionName).add(team)
  }

  getTeams(userId: String) {
    return this.firestore.collection(this.collectionName).snapshotChanges()
  }
}
