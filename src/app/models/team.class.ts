import { Project } from './project.class';

export interface Team {
    name: String;
    owner: String,
    members: []

    projects: Project[]
}