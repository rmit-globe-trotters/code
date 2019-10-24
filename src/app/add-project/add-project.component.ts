import { Component, OnInit } from "@angular/core";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { ProjectService } from "../services/project.service";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-project",
  templateUrl: "./add-project.component.html",
  styleUrls: ["./add-project.component.scss"]
})
export class AddProjectComponent implements OnInit {
  projectForm = new FormGroup({
    name: new FormControl("", Validators.required),
    description: new FormControl("", Validators.required)
  });

  loggedInUser: any;

  constructor(
    private afAuth: AngularFireAuth,
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      this.loggedInUser = user;
    });
  }

  saveProject() {
    if (!this.projectForm.valid) {
      return;
    }

    this.projectService.addProject({
      name: this.projectForm.value.name,
      description: this.projectForm.value.description,
      creator: this.loggedInUser.uid,
      members: []
    });
    this.router.navigateByUrl("/");
  }
}
