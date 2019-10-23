import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"]
})
export class BoardComponent implements OnInit {
  taskGroups = [
    {
      state: "Not Started",
      tasks: [
        {
          name: "Laundry",
          assignedTo: null
        },
        {
          name: "Sweep floors",
          assignedTo: null
        },
        {
          name: "Take out rubbish",
          assignedTo: null
        },
        {
          name: "Renew car registration",
          assignedTo: null
        }
      ]
    },
    {
      state: "In Progress",
      tasks: [
        {
          name: "Do uni homework",
          assignedTo: "Luke"
        }
      ]
    },
    {
      state: "Done",
      tasks: [
        {
          name: "Take dog out for walk",
          assignedTo: "Luke"
        }
      ]
    }
  ];

  constructor(private modalService: NgbModal) {}

  editTask(content) {
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
  }

  ngOnInit() {}
}
