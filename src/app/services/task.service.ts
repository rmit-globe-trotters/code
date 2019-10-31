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
      id: Math.random().toString(),
      projectId: this.project1Name,
      text: "So the thing",
      state: TaskState.NotStarted,
      description: "Some random thing",
      assignedTo: null
    },
    {
      id: Math.random().toString(),
      projectId: this.project1Name,
      text: "So the thing",
      state: TaskState.NotStarted,
      description: "Some random thing",
      assignedTo: null
    },
    {
      id: Math.random().toString(),
      projectId: this.project1Name,
      text: "So the thing",
      state: TaskState.NotStarted,
      description: "Some random thing",
      assignedTo: null
    },
    {
      id: Math.random().toString(),
      projectId: this.project1Name,
      text: "So the thing",
      state: TaskState.NotStarted,
      description: "Some random thing",
      assignedTo: null
    },
    {
      id: Math.random().toString(),
      projectId: this.project1Name,
      text: "So the thing",
      state: TaskState.NotStarted,
      description: "Some random thing",
      assignedTo: null
    },
    {
      id: Math.random().toString(),
      projectId: this.project1Name,
      text: "So the thing",
      state: TaskState.NotStarted,
      description: "Some random thing",
      assignedTo: null
    }
  ];

  constructor() {}

  async addTask(task: Task) {
    task.id = Math.random().toString();
    this.tasks.push(task);
    return await task;
  }

  async updateTask(updatedTask: Task) {
    const task = this.tasks.find(t => t.id === updatedTask.id);
    task.text = updatedTask.text;
    task.state = updatedTask.state;
    task.description = updatedTask.description;
    return await task;
  }
}
