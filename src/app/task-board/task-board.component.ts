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

  tasks = [
    { id: 'task1', name: 'Sample task 1', duedate: '08-02-2024', description: 'Test desc 1', sequence: 1, color: 'yellow', priority: 2, isComplete: true },
    { id: 'task2', name: 'Sample task 2', duedate: '08-03-2024', description: 'Test desc 2', sequence: 2, color: 'purple', priority: 1, isComplete: true },
    { id: 'task3', name: 'Sample task 3', duedate: '08-04-2024', description: 'Test desc 3', sequence: 3, color: 'pink', priority: 3, isComplete: true },
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
    this.ftsModalService.notifyTaskUpdated();
    this.alertService.alert(AlertType.Success, '1 task deleted');

  }

  completeTask(task: Task) {
    task.isComplete = true;
    this.updateTaskInLocalStorage(task);
    this.ftsModalService.notifyTaskUpdated();
    this.alertService.alert(AlertType.Success, '1 task completed', true, 5000);
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
    // const today = new Date();
    // const dueDate = new Date(task.duedate);

    //This code is only for comparing days not the time
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight

    const dueDate = new Date(task.duedate);
    dueDate.setHours(0, 0, 0, 0); // Set time to midnight
    const colorKey = dueDate < today ? 'red' : 'blue';

    return setBg ? this.pillBackgroundMap[colorKey] || '' : this.pillTextMap[colorKey] || '';
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
      const dueDateA = new Date(a.duedate).getTime();
      const dueDateB = new Date(b.duedate).getTime();
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
}
