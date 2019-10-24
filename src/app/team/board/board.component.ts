import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { ProjectService } from "src/app/services/project.service";
import { map, tap } from "rxjs/operators";
import { TaskService } from "src/app/services/task.service";
import { Task } from "src/app/models/task.class";
import { TaskState } from "src/app/models/task-state.enum";
import { groupBy } from "ramda";
import { Observable, of } from "rxjs";
import { Project } from "src/app/models/project.class";

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

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private modalService: NgbModal,
    private route: ActivatedRoute
  ) {}

  editTask(content) {
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
  }

  ngOnInit() {
    this.project$ = this.route.paramMap.pipe(
      map((params: ParamMap) => {
        return this.projectService.projects.find(
          p => p.name === params.get("projectId")
        );
      }),
      tap()
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
}
