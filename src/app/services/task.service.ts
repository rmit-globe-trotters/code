import { Injectable } from "@angular/core";
import { Task } from "../models/task.class";
import { TaskState } from "../models/task-state.enum";

@Injectable({
  providedIn: "root"
})
export class TaskService {
  project1Name = "Project 1";
  tasks: Task[] = [
    {
      projectId: this.project1Name,
      text: "So the thing",
      state: TaskState.NotStarted,
      description: "Some random thing",
      assignedTo: null
    },
    {
      projectId: this.project1Name,
      text: "So the thing",
      state: TaskState.NotStarted,
      description: "Some random thing",
      assignedTo: null
    },
    {
      projectId: this.project1Name,
      text: "So the thing",
      state: TaskState.NotStarted,
      description: "Some random thing",
      assignedTo: null
    },
    {
      projectId: this.project1Name,
      text: "So the thing",
      state: TaskState.NotStarted,
      description: "Some random thing",
      assignedTo: null
    },
    {
      projectId: this.project1Name,
      text: "So the thing",
      state: TaskState.NotStarted,
      description: "Some random thing",
      assignedTo: null
    },
    {
      projectId: this.project1Name,
      text: "So the thing",
      state: TaskState.NotStarted,
      description: "Some random thing",
      assignedTo: null
    }
  ];

  constructor() {}

  addTask(task: Task) {
    this.tasks.push(task);
  }
}
