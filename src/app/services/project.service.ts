import { Injectable } from "@angular/core";
import { Project } from "../models/project.class";

@Injectable({
  providedIn: "root"
})
export class ProjectService {
  public projects: Project[] = [
    {
      name: "Project 1",
      description:
        "A fake project that is here to show some content on the page",
      creator: "Luke",
      members: ["Luke", "John"]
    },
    {
      name: "Project 2",
      description: "A slightly different description",
      creator: "Luke",
      members: ["Mohamed", "John"]
    },
    {
      name: "Project 3",
      description: "I love projects",
      creator: "Luke",
      members: ["Austin", "Mohamed"]
    }
  ];

  constructor() {}

  addProject(project: Project) {
    this.projects.push(project);
  }
}
