import { Component } from '@angular/core';
import { FtsModalService } from '../shared/fts-modal.service';
import { Task } from '../shared/models/task.model';
import { Subscription } from 'rxjs';
import { FtsAlertService } from '../shared/services/fts-alert.service';
import { AlertType } from '../shared/models/alert-config.model';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent {

  selectedPriority: number = 1;

  tasks: Task[] = [
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

  noTaskAdded: boolean = false;

  private taskUpdatedSubscription: Subscription;
  private alertActionSubscription: Subscription;

  ngOnInit() {
    // Retrieve tasks from local storage
    const existingTasksString = localStorage.getItem('tasks');
    const existingTasks = existingTasksString ? JSON.parse(existingTasksString) : [];

    // If tasks are found in local storage, use them; otherwise, use the default tasks
    this.tasks = existingTasks.length > 0 ? existingTasks : this.tasks;

    // Check if there are any tasks with isComplete set to false
    this.checkNoTaskAdded();
  }

  constructor(private ftsModalService: FtsModalService, private alertService: FtsAlertService) {
    this.taskUpdatedSubscription = this.ftsModalService.taskUpdatedSubject.subscribe(() => {
      // Update the tasks array when notified
      this.updateTasks();
    });
    this.alertActionSubscription = this.alertService.buttonClick$.subscribe((data) => {
      this.undoCompleteTask(data);
    });
  }

  ngOnDestroy() {
    // Unsubscribe from the subject to prevent memory leaks
    this.taskUpdatedSubscription.unsubscribe();
    this.alertActionSubscription.unsubscribe();
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
    this.ftsModalService.notifyTaskUpdated();
    this.alertService.alert(AlertType.Success, '1 task deleted');

  }

  completeTask(task: Task) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to month because it's zero-based
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');

    task.isComplete = true;
    task.completedAt = `${hours}:${minutes}`;
    task.completedOn = `${year}-${month}-${day}`;
    this.updateTaskInLocalStorage(task);
    this.ftsModalService.notifyTaskUpdated();
    this.alertService.alert(AlertType.Success, '1 task completed', false, 5000, true, 'Undo', task);
  }

  undoCompleteTask(task: Task) {
    task.isComplete = false;
    task.completedAt = '';
    task.completedOn = '';
    this.updateTaskInLocalStorage(task);
    this.ftsModalService.notifyTaskUpdated();
    this.alertService.alert(AlertType.Success, 'Undone successfully');
  }

  private updateTasks() {
    // Retrieve tasks from local storage
    const existingTasksString = localStorage.getItem('tasks');
    const existingTasks = existingTasksString ? JSON.parse(existingTasksString) : [];

    // Update the tasks array
    this.tasks = existingTasks;
    this.checkNoTaskAdded();
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

  handleDragStart(index: number, event: DragEvent, dragElement: HTMLElement) {
    this.draggedIndex = index;
    const invisibleClone = dragElement.cloneNode(true) as HTMLElement;
    invisibleClone.style.opacity = '0';
    document.body.appendChild(invisibleClone);
    event.dataTransfer?.setDragImage(invisibleClone, 0, 0);
    setTimeout(() => {
      document.body.removeChild(invisibleClone);
    }, 0);
  }

  handleDragOver(index: number, event: DragEvent, dragElement: HTMLElement) {
    if (this.draggedIndex === null) return;

    const updatedTasks = [...this.tasks];
    const draggedTask = updatedTasks[this.draggedIndex];

    draggedTask.sequence = index + 1;

    updatedTasks.splice(this.draggedIndex, 1);
    updatedTasks.splice(index, 0, draggedTask);

    updatedTasks.forEach((task, i) => {
      task.sequence = i + 1;
    });

    this.tasks = updatedTasks;
    this.draggedIndex = index;
    this.draggedOverIndex = index;

    // Prevent the default behavior of dragover
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  handleDragEnd() {
    this.draggedIndex = null;
    this.draggedOverIndex = null;
    this.ftsModalService.notifyTaskUpdated();
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
      const dueDateA = new Date(`${a.duedate} ${a.dueTime}`).getTime();
      const dueDateB = new Date(`${b.duedate} ${b.dueTime}`).getTime();
      return dueDateA - dueDateB; // Sort in ascending order
    });
  }


  sortDueDate() {
    this.sortTasksByDueDateEarliestFirst(); // Sort with the earliest due date first
  }

  // Function to check if there are no tasks with isComplete set to false
  private checkNoTaskAdded() {
    this.noTaskAdded = this.tasks.every(task => task.isComplete === true);
  }

  getTimeLeft(task: Task): string {
    debugger
    const now = new Date().getTime(); // Convert current date to milliseconds
    const dueDateTime = new Date(`${task.duedate} ${task.dueTime}`).getTime(); // Convert task's due date and time to milliseconds
    const timeDifference = dueDateTime - now;

    if (timeDifference < 0) {
      return 'Task overdue';
    }

    const daysLeft = Math.floor(timeDifference / 86400000); // 1 day = 86400000 milliseconds
    const hoursLeft = Math.floor((timeDifference % 86400000) / 3600000); // 1 hour = 3600000 milliseconds
    const minutesLeft = Math.floor((timeDifference % 3600000) / 60000); // 1 minute = 60000 milliseconds
    const secondsLeft = Math.floor((timeDifference % 60000) / 1000); // 1 second = 1000 milliseconds

    let timeLeftString = '';
    if (daysLeft > 0) {
      timeLeftString += `${daysLeft}d `;
    }
    if (hoursLeft > 0) {
      timeLeftString += `${hoursLeft}h `;
    }
    if (minutesLeft > 0 || daysLeft > 0 || hoursLeft > 0) {
      timeLeftString += `${minutesLeft}m `;
    } else if (secondsLeft > 0) {
      timeLeftString = 'few seconds ';
    }

    return timeLeftString + 'left';
  }

}
