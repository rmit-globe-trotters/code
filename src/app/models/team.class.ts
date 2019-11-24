import { Project } from './project.class';

export interface Team {
  name: string;
  owner: string;
  members: [];

  projects: Project[];
}
