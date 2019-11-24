import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { Project } from '../models/project.class';

@Component({
  selector: 'app-edit-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {
  projectForm = new FormGroup({
    name: new FormControl('', Validators.required),
    members: new FormControl([]),
    description: new FormControl('', Validators.required)
  });
  // tslint:disable-next-line: variable-name
  _project: Project;

  @Input()
  set project(value: Project) {
    this._project = value;

    if (!this._project) {
      return;
    }

    this.projectForm.controls.name.setValue(this._project.name);
    this.projectForm.controls.description.setValue(this._project.description);

    this.users$.subscribe(() => {
      this.projectForm.controls.members.setValue(this._project.members);
    });
  }

  get project(): Project {
    return this._project;
  }

  @Output()
  save = new EventEmitter<Project>();

  @Output()
  remove = new EventEmitter();

  loggedInUser: any;
  users$: Observable<any[]>;

  constructor(
    private afAuth: AngularFireAuth,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      this.loggedInUser = user;
    });
    this.users$ = this.userService.users$;
  }

  async saveProject() {
    if (!this.projectForm.valid) {
      return;
    }

    const id = this.project ? this.project.id : null;
    const project = { id, ...this.projectForm.value };
    return this.save.emit(project);
  }
}
