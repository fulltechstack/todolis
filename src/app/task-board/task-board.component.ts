import { Component } from '@angular/core';
import { FtsModalService } from '../shared/fts-modal.service';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent {

  tasks = [
    { id: 'task1', name: 'Call Sam For payments', status: 'Rejected', description: 'Bob', color: 'bg-yellow' },
    { id: 'task2', name: 'Make payment to Bluedart', status: 'New', description: 'Johnny', color: 'bg-purple' },
    { id: 'task3', name: 'Office rent', status: 'In Progress', description: 'Samino!', color: 'bg-pink' },
    { id: 'task4', name: 'Office grocery shopping', status: 'Completed', description: 'Tida', color: 'bg-yellow' },
    { id: 'task5', name: 'Ask for Lunch to Clients', status: 'In Progress', description: 'Office Admin', color: 'bg-pink' },
    { id: 'task6', name: 'Client Meeting at 11 AM', status: 'Pending', description: 'CEO', color: 'bg-yellow' },
    { id: 'task1', name: 'Call Sam For payments', status: 'Rejected', description: 'Bob', color: 'bg-yellow' },
    { id: 'task2', name: 'Make payment to Bluedart', status: 'New', description: 'Johnny', color: 'bg-purple' },
    { id: 'task3', name: 'Office rent', status: 'In Progress', description: 'Samino!', color: 'bg-pink' },
    { id: 'task4', name: 'Office grocery shopping', status: 'Completed', description: 'Tida', color: 'bg-yellow' },
  ];

  ngOnInit() {
    // Retrieve tasks from local storage
    const existingTasksString = localStorage.getItem('tasks');
    const existingTasks = existingTasksString ? JSON.parse(existingTasksString) : [];

    // If tasks are found in local storage, use them; otherwise, use the default tasks
    this.tasks = existingTasks.length > 0 ? existingTasks : this.tasks;
  }

  constructor(private ftsModalService: FtsModalService) { }

  addTask() {
    const data = {
      isAdd: true,
      taskData: null
    };
    this.ftsModalService.openModal(data);
  }

  editTask(task: any) {
    const data = {
      isAdd: false,
      taskData: task
    };
    this.ftsModalService.openModal(data);
  }

}
