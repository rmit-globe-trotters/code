import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { User } from "firebase";
import { Project } from "../models/project.class";
import { ProjectService } from "../services/project.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  projects: Project[];

  loggedInUser: User;

  constructor(
    private afAuth: AngularFireAuth,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      this.loggedInUser = user;
    });
    this.projects = this.projectService.projects;
  }
}
