import { Component } from '@angular/core';
import { FtsModalService } from '../shared/fts-modal.service';
import { Task } from '../shared/models/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent {

  tasks = [
    { id: 'task1', name: 'Call Sam For payments', status: 'Rejected', description: 'Bob', sequence: 1, color: 'bg-yellow' },
    { id: 'task2', name: 'Make payment to Bluedart', status: 'New', description: 'Johnny', sequence: 2, color: 'bg-purple' },
    { id: 'task3', name: 'Office rent', status: 'In Progress', description: 'Samino!', sequence: 3, color: 'bg-pink' },
    { id: 'task4', name: 'Office grocery shopping', status: 'Completed', description: 'Tida', sequence: 4, color: 'bg-yellow' },
    { id: 'task5', name: 'Ask for Lunch to Clients', status: 'In Progress', description: 'Office Admin', sequence: 5, color: 'bg-pink' },
    { id: 'task6', name: 'Client Meeting at 11 AM', status: 'Pending', description: 'CEO', sequence: 6, color: 'bg-yellow' },
    { id: 'task1', name: 'Call Sam For payments', status: 'Rejected', description: 'Bob', sequence: 7, color: 'bg-yellow' },
    { id: 'task2', name: 'Make payment to Bluedart', status: 'New', description: 'Johnny', sequence: 8, color: 'bg-purple' },
    { id: 'task3', name: 'Office rent', status: 'In Progress', description: 'Samino!', sequence: 9, color: 'bg-pink' },
    { id: 'task4', name: 'Office grocery shopping', status: 'Completed', description: 'Tida', sequence: 10, color: 'bg-yellow' },
  ];

  private taskUpdatedSubscription: Subscription;

  ngOnInit() {
    // Retrieve tasks from local storage
    const existingTasksString = localStorage.getItem('tasks');
    const existingTasks = existingTasksString ? JSON.parse(existingTasksString) : [];

    // If tasks are found in local storage, use them; otherwise, use the default tasks
    this.tasks = existingTasks.length > 0 ? existingTasks : this.tasks;
  }

  constructor(private ftsModalService: FtsModalService) {
    this.taskUpdatedSubscription = this.ftsModalService.taskUpdatedSubject.subscribe(() => {
      // Update the tasks array when notified
      this.updateTasks();
    });
  }

  ngOnDestroy() {
    // Unsubscribe from the subject to prevent memory leaks
    this.taskUpdatedSubscription.unsubscribe();
  }

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

  deleteTask(taskToDelete: Task) {
    // Get existing tasks from localStorage (if any)
    const existingTasksString = localStorage.getItem('tasks');
    let existingTasks: Task[] = existingTasksString ? JSON.parse(existingTasksString) : [];

    // Find the index of the task to delete
    const taskIndex = existingTasks.findIndex((t: Task) => t.id === taskToDelete.id);

    if (taskIndex !== -1) {
      // Remove the task from the existing tasks array
      existingTasks.splice(taskIndex, 1);

      // Save the updated tasks array back to localStorage
      localStorage.setItem('tasks', JSON.stringify(existingTasks));

      // Optionally, you can update the tasks property used in your component
      this.tasks = existingTasks;
    }
  }

  private updateTasks() {
    // Retrieve tasks from local storage
    const existingTasksString = localStorage.getItem('tasks');
    const existingTasks = existingTasksString ? JSON.parse(existingTasksString) : [];

    // Update the tasks array
    this.tasks = existingTasks;
  }
}
