import { Component } from '@angular/core';
import { FtsModalService } from '../shared/fts-modal.service';
import { Task } from '../shared/models/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-completed-tasks-board',
  templateUrl: './completed-tasks-board.component.html',
  styleUrls: ['./completed-tasks-board.component.scss']
})
export class CompletedTasksBoardComponent {


  selectedPriority: number = 1;

  tasks = [
    { id: 'task2', name: 'Sample task 2', duedate: '08-03-2024', description: 'Test desc 2', sequence: 2, color: 'purple', priority: 1, isComplete: true, completedAt: '12-03-2024', completedOn: '08:40', dueTime: '07:48', createdBy: 'Akash' },
  ];

  priorityColorMap: { [key: string]: string } = {
    1: '#B6E2A1',
    2: '#F7B924',
    3: '#FF7878'
  };

  colorBackgroundMap: { [key: string]: string } = {
    purple: '#f8f0ff',
    yellow: '#fffff5',
    pink: '#fff8ff'
  };

  pillBackgroundMap: { [key: string]: string } = {
    red: '#FFC6C6',
    cyan: '#E0F4FF',
    blue: '#C6C6FF'
  };

  pillTextMap: { [key: string]: string } = {
    red: '#740101',
    cyan: '#87C4FF',
    blue: '#00008B'
  };

  draggedIndex: number | null = null;
  draggedOverIndex: number | null = null;

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
      taskData: null,
      isViewOnly: false
    };
    this.ftsModalService.openModal(data);
  }

  editTask(task: any) {
    const data = {
      isAdd: false,
      taskData: task,
      isViewOnly: false
    };
    this.ftsModalService.openModal(data);
  }

  viewTask(task: any) {
    const data = {
      isAdd: false,
      taskData: task,
      isViewOnly: true
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

  completeTask(task: Task) {
    task.isComplete = true;
    this.updateTaskInLocalStorage(task);
    this.ftsModalService.notifyTaskUpdated();
  }

  private updateTasks() {
    // Retrieve tasks from local storage
    const existingTasksString = localStorage.getItem('tasks');
    const existingTasks = existingTasksString ? JSON.parse(existingTasksString) : [];

    // Update the tasks array
    this.tasks = existingTasks;
  }

  private updateTaskInLocalStorage(task: Task) {
    // Get existing tasks from localStorage (if any)
    const existingTasksString = localStorage.getItem('tasks');
    let existingTasks: Task[] = existingTasksString ? JSON.parse(existingTasksString) : [];

    // Find the index of the task to update
    const taskIndex = existingTasks.findIndex((t: Task) => t.id === task.id);

    if (taskIndex !== -1) {
      // Update the task in the existing tasks array
      existingTasks[taskIndex] = task;

      // Save the updated tasks array back to localStorage
      localStorage.setItem('tasks', JSON.stringify(existingTasks));

      // Optionally, you can update the tasks property used in your component
      this.tasks = existingTasks;
    }
  }

  getBorderColor(priority: number): string {
    // Use the priorityColorMap to get the corresponding color for the priority
    return this.priorityColorMap[priority.toString()] || '';
  }

  getColorBackground(color: string): string {
    // Use the colorBackgroundMap to get the corresponding background color
    return this.colorBackgroundMap[color] || '';
  }

  getPillColors(task: Task, setBg: boolean): string {
    const today = new Date();
    const dueDateTime = new Date(`${task.duedate} ${task.dueTime}`);

    if (dueDateTime < today) {
      return setBg ? this.pillBackgroundMap['red'] || '' : this.pillTextMap['red'] || '';
    } else {
      return setBg ? this.pillBackgroundMap['blue'] || '' : this.pillTextMap['blue'] || '';
    }
  }

  sortTasksByPriorityAscending() {
    this.tasks.sort((a, b) => a.priority - b.priority);
  }
  sortTasksByPriorityDescending() {
    this.tasks.sort((a, b) => b.priority - a.priority);
  }

  selectPriority(priority: number | null) {
    if (priority === 1) {
      this.sortTasksByPriorityDescending();
    } else {
      this.sortTasksByPriorityAscending();
    }
  }

  // Sort tasks by due date with the earliest due date first
  sortTasksByDueDateEarliestFirst() {
    this.tasks.sort((a, b) => {
      const dueDateA = new Date(a.duedate).getTime();
      const dueDateB = new Date(b.duedate).getTime();
      return dueDateA - dueDateB; // Sort in ascending order
    });
  }

  sortDueDate() {
    this.sortTasksByDueDateEarliestFirst(); // Sort with the earliest due date first
  }

  getTimeLeft(task: Task): string {
    const dueDateTime = new Date(`${task.duedate} ${task.dueTime}`).getTime(); // Convert due date and time to milliseconds
    const completedDateTime = new Date(`${task.completedOn} ${task.completedAt}`).getTime(); // Convert completed date and time to milliseconds
    const timeDifference = completedDateTime - dueDateTime;

    const days = Math.floor(Math.abs(timeDifference) / 86400000); // 1 day = 86400000 milliseconds
    const hours = Math.floor((Math.abs(timeDifference) % 86400000) / 3600000); // 1 hour = 3600000 milliseconds
    const minutes = Math.floor((Math.abs(timeDifference) % 3600000) / 60000); // 1 minute = 60000 milliseconds

    if (timeDifference < 0) {
      return `Task completed ${days}d ${hours}h ${minutes}m before due`;
    }

    if (timeDifference === 0) {
      return 'Task completed on time';
    }

    return `Task completed ${days}d ${hours}h ${minutes}m after due`;
  }
}

