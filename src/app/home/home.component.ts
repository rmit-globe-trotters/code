import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { User } from "firebase";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  projects = [
    {
      name: "Project 1",
      description:
        "A fake project that is here to show some content on the page",
      members: ["Luke", "John"]
    },
    {
      name: "Project 2",
      description: "A slightly different description",
      members: ["Mohamed", "John"]
    },
    {
      name: "Project 3",
      description: "I love projects",
      members: ["Austin", "Mohamed"]
    }
  ];

  loggedInUser: User;

  constructor(private afAuth: AngularFireAuth) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      this.loggedInUser = user;
    });
  }
}
