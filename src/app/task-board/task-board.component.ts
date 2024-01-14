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
    { id: 'task1', name: 'Sample task 1', status: 'Rejected', description: 'Test desc 1', sequence: 1, color: 'yellow', priority: 2 },
    { id: 'task2', name: 'Sample task 2', status: 'New', description: 'Test desc 2', sequence: 2, color: 'purple', priority: 1 },
    { id: 'task3', name: 'Sample task 3', status: 'In Progress', description: 'Test desc 3', sequence: 3, color: 'pink', priority: 3 },
  ];

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

}
