import { Component } from '@angular/core';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent {

  tasks = ['Task 1', 'Task 2', 'Task 3']; // Example tasks

  addTask() {
    const newTask = `Task ${this.tasks.length + 1}`;
    this.tasks.push(newTask);
  }
}
