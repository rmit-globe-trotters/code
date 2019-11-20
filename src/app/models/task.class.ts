import { TaskState } from './task-state.enum';
import { User } from './user';

export interface Task {
  id?: string;
  projectId: string;
  text: string;
  description: string;
  state: TaskState;
  assignedTo: string;
  assignedUser?: User;
}
