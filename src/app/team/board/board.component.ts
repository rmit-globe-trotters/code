import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { ProjectService } from "src/app/services/project.service";
import { map, tap } from "rxjs/operators";
import { TaskService } from "src/app/services/task.service";
import { Task } from "src/app/models/task.class";
import { TaskState } from "src/app/models/task-state.enum";
import { mergeDeepRight } from "ramda";
import { Observable, of } from "rxjs";
import { Project } from "src/app/models/project.class";
import { FormGroup, FormControl, Validators } from "@angular/forms";

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
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"]
})
export class BoardComponent implements OnInit {
  project$: Observable<Project>;
  taskGroups$: Observable<TaskGroup[]>;
  states = TaskState;
  selectedTask: Task;
  taskForm = new FormGroup({
    text: new FormControl("", Validators.required),
    state: new FormControl("", Validators.required),
    description: new FormControl("")
  });
  isListView = false;
  tasks: Task[];

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private modalService: NgbModal,
    private route: ActivatedRoute
  ) {}

  addTask(content, state: TaskState) {
    this.selectedTask = null;
    this.taskForm.setValue({
      text: null,
      description: null,
      state
    });

    this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg"
    });
  }

  editTask(content, task: Task) {
    this.selectedTask = task;
    this.taskForm.setValue({
      text: task.text,
      description: task.description,
      state: task.state
    });

    this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg"
    });
  }

  saveTask() {
    const updatedTask = mergeDeepRight(this.selectedTask, this.taskForm.value);
    const resetState = () => {
      this.taskForm.setValue({
        text: "",
        description: "",
        state: ""
      });
      this.selectedTask = null;
      this.modalService.dismissAll();
      this.taskGroups$ = this.project$.pipe(
        map(project => this.createTaskGroups(project))
      );
    };

    if (this.selectedTask) {
      this.taskService.updateTask(updatedTask).then(resetState);
    } else {
      this.project$.subscribe(project => {
        updatedTask.projectId = project.name;
        this.taskService.addTask(updatedTask);
        this.taskGroups$ = of(this.createTaskGroups(project));
        resetState();
      });
    }
  }

  closeModal(modal) {
    modal.dismiss("Closing model without saving");
  }

  ngOnInit() {
    this.project$ = this.route.paramMap.pipe(
      map((params: ParamMap) => {
        return this.projectService.projects.find(
          p => p.name === params.get("projectId")
        );
      })
    );
    this.taskGroups$ = this.project$.pipe(
      map(project => this.createTaskGroups(project))
    );
  }

  getStateChangeText({ state }: Task) {
    switch (state) {
      case TaskState.NotStarted:
        return "Start";
      case TaskState.InProgress:
        return "Complete";
      case TaskState.Done:
        return "Rework";
    }
    return "Move";
  }

  getStateIconClass({ state }: Task) {
    switch (state) {
      case TaskState.NotStarted:
        return "fa fa-arrow-right";
      case TaskState.InProgress:
        return "fa fa-check";
      case TaskState.Done:
        return "fa fa-arrow-left";
    }
    return "Move";
  }

  createTaskGroups(project) {
    return this.taskService.tasks
      .filter(t => t.projectId === project.name)
      .reduce((acc, task) => {
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
      }, createInitialGroups());
  }

  changeIconState(project, task) {
    if (task.state === TaskState.NotStarted) {
      task.state = TaskState.InProgress;
    } else if (task.state === TaskState.InProgress) {
      task.state = TaskState.Done;
    } else if (task.state === TaskState.Done) {
      task.state = TaskState.InProgress;
    }
    this.taskGroups$ = of(this.createTaskGroups(project));
  }

  showListView() {
    this.isListView = true;
    this.tasks = this.taskService.tasks;
  }

  hideListView() {
    this.isListView = false;
  }
}
