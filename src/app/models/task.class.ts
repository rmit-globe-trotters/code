import { TaskState } from "./task-state.enum";

export interface Task {
  projectId: string;
  text: string;
  description: string;
  state: TaskState;
  assignedTo: string;
}
