import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { map, tap, switchMap } from 'rxjs/operators';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/models/task.class';
import { TaskState } from 'src/app/models/task-state.enum';
import { mergeDeepRight } from 'ramda';
import { Observable, of } from 'rxjs';
import { Project } from 'src/app/models/project.class';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'firebase';

interface TaskGroup {
  state: TaskState;
  tasks: Task[];
}

const createInitialGroups = (): TaskGroup[] => [
  { state: TaskState.NotStarted, tasks: [] },
  { state: TaskState.InProgress, tasks: [] },
  { state: TaskState.Done, tasks: [] }
];

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {
  project$: Observable<Project>;
  taskGroups$: Observable<TaskGroup[]>;
  states = TaskState;
  selectedTask: Task;
  taskForm = new FormGroup({
    text: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    description: new FormControl(''),
    assignedTo: new FormControl()
  });
  isListView = false;
  tasks: Task[];
  tasks$: Observable<Task[]>;
  projects$: Observable<Project[]>;
  users: User[];
  userSub: any;

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  changeProject(projectId: string) {
    this.router.navigate(['board', projectId]);
  }

  addTask(content, state: TaskState) {
    this.selectedTask = null;
    this.taskForm.setValue({
      text: null,
      description: null,
      state,
      assignedTo: ''
    });

    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg'
    });
  }

  editTask(content, task: Task) {
    this.selectedTask = task;
    this.taskForm.setValue({
      text: task.text,
      description: task.description,
      state: task.state,
      assignedTo: task.assignedTo
    });

    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg'
    });
  }

  removeTask(taskId, projectId) {
    this.taskService.remove(taskId, projectId);
    this.modalService.dismissAll();
  }

  removeProject() {
    return this.project$.subscribe(project => {
      this.projectService.removeProject(project.id);
      this.router.navigate(['/']);
    });
  }
  saveTask() {
    const updatedTask: Task = mergeDeepRight(this.selectedTask, this.taskForm.value);
    const resetState = () => {
      this.taskForm.setValue({
        text: '',
        description: '',
        state: '',
        assignedTo: ''
      });
      this.selectedTask = null;
      this.modalService.dismissAll();
    };

    if (this.selectedTask) {
      this.taskService.updateTask(updatedTask).then(resetState);
    } else {
      this.project$.subscribe(project => {
        this.taskService
          .addTask(
            project.id,
            updatedTask.text,
            updatedTask.description,
            updatedTask.state,
            updatedTask.assignedTo
          )
          .then(resetState);
      });
    }
  }

  editProject(modal) {
    this.modalService.open(modal, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg'
    });
  }

  saveProject(project: Project) {
    this.projectService.updateProject(project).subscribe(() => {
      this.modalService.dismissAll();
    });
  }

  closeModal(modal) {
    modal.dismiss('Closing model without saving');
  }

  ngOnInit() {
    this.projects$ = this.projectService.getProjects();
    this.project$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.projectService.getProject(params.get('id'));
      })
    );
    this.tasks$ = this.project$.pipe(switchMap(project => this.taskService.getTasks(project.id)));
    this.taskGroups$ = this.tasks$.pipe(
      map(tasks =>
        tasks.reduce((acc, task) => {
          const existingGroup = acc.find(t => t.state === task.state);

          if (existingGroup) {
            existingGroup.tasks.push(task);
          } else {
            acc.push({
              state: task.state,
              tasks: [task]
            });
          }
          return acc;
        }, createInitialGroups())
      )
    );

    this.userSub = this.project$
      .pipe(switchMap(project => this.projectService.getMembers(project.id)))
      .subscribe(users => {
        this.users = users;
      });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  getStateChangeText({ state }: Task) {
    switch (state) {
      case TaskState.NotStarted:
        return 'Start';
      case TaskState.InProgress:
        return 'Complete';
      case TaskState.Done:
        return 'Rework';
    }
    return 'Move';
  }

  getStateIconClass({ state }: Task) {
    switch (state) {
      case TaskState.NotStarted:
        return 'fa fa-arrow-right';
      case TaskState.InProgress:
        return 'fa fa-check';
      case TaskState.Done:
        return 'fa fa-arrow-left';
    }
    return 'Move';
  }

  changeIconState(project, task) {
    const stateTransitions = {
      [TaskState.NotStarted]: TaskState.InProgress,
      [TaskState.InProgress]: TaskState.Done,
      [TaskState.Done]: TaskState.InProgress
    };
    const nextState = stateTransitions[task.state];
    return this.taskService.changeState(task.id, project.id, nextState);
  }

  showListView() {
    this.isListView = true;
  }

  hideListView() {
    this.isListView = false;
  }
}
