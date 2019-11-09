import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ProjectService } from '../services/project.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { map, take, tap, takeLast } from 'rxjs/operators';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {
  projectForm = new FormGroup({
    name: new FormControl('', Validators.required),
    members: new FormControl(''),
    description: new FormControl('', Validators.required)
  });

  loggedInUser: any;
  users$: Observable<any[]>;

  constructor(
    private afAuth: AngularFireAuth,
    private projectService: ProjectService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      this.loggedInUser = user;
    });
    this.users$ = this.userService.getUsers();
  }

  async saveProject() {
    if (!this.projectForm.valid) {
      return;
    }

    this.projectService
      .addProject({
        name: this.projectForm.value.name,
        description: this.projectForm.value.description,
        members: this.projectForm.value.members
      })
      .subscribe(() => this.router.navigateByUrl('/'));
  }
}
// lukejkw: ejCLLduqElYpY6d7Pqp7hsFEXYd2
// student: zIKMISBm70X3s7IfIc70KpPv5452
