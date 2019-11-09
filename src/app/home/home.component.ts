import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { Project } from '../models/project.class';
import { ProjectService } from '../services/project.service';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loggedInUser: User;
  projects$: Observable<Project[]>;

  constructor(
    private afAuth: AngularFireAuth,
    private projectService: ProjectService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      this.userService.saveUserDetails(user).then(() => {
        this.loggedInUser = user;
      });
    });
    this.projects$ = this.projectService.getProjects();
  }
}
