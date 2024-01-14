import { Component, Input, ElementRef } from '@angular/core';
import { FtsModalService } from '../fts-modal.service';

@Component({
  selector: 'app-fts-modal',
  templateUrl: './fts-modal.component.html',
  styleUrls: ['./fts-modal.component.scss']
})
export class FtsModalComponent {
  @Input() data: any;
  taskName: string = '';
  taskDescription: string = '';

  constructor(
    private ftsModalService: FtsModalService,
    private elementRef: ElementRef // Inject ElementRef
  ) { }

  ngOnInit() {
    if (!this.data.isAdd) {
      this.taskName = this.data.taskData.name;
      this.taskDescription = this.data.taskData.description;
    }
  }

  closeModal(event: MouseEvent): void {
    // Get the DOM element of the modal
    const modalElement = this.elementRef.nativeElement;

    // Check if the click event target is the modal itself or any of its children
    if (modalElement.contains(event.target)) {
      this.ftsModalService.closeModal();
    }
  }

  // save() {
  //   // Create a task object with the data
  //   const task = {
  //     id: 'task1',
  //     name: this.taskName,
  //     status: 'Rejected',
  //     description: this.taskDescription,
  //     color: 'bg-yellow'
  //   }

  //   // Get existing tasks from localStorage (if any)
  //   const existingTasksString = localStorage.getItem('tasks');
  //   const existingTasks = existingTasksString ? JSON.parse(existingTasksString) : [];

  //   // Add the new task to the existing tasks array
  //   existingTasks.push(task);

  //   // Save the updated tasks array back to localStorage
  //   localStorage.setItem('tasks', JSON.stringify(existingTasks));

  //   // Close the modal or perform any other action as needed
  //   this.ftsModalService.closeModal();
  // }

  save() {
    const task = {
      id: 'taskName' + Math.random(),
      name: this.taskName,
      status: 'Rejected',
      description: this.taskDescription,
      color: 'bg-yellow'
    };

    let existingTasks = [];

    const existingTasksString = localStorage.getItem('tasks');
    if (existingTasksString) {
      existingTasks = JSON.parse(existingTasksString);

      if (!this.data.isAdd && this.data.taskData) {
        // If it's an edit operation, find and update the existing task
        const index = existingTasks.findIndex((t: Task) => t.id === this.data.taskData.id);
        if (index !== -1) {
          existingTasks[index] = { ...existingTasks[index], ...task };
        }
      } else {
        // If it's not an edit operation, generate a new ID and add the task
        task.id = 'task' + (existingTasks.length + 1);
        existingTasks.push(task);
      }

      // Save the updated tasks array back to localStorage
      localStorage.setItem('tasks', JSON.stringify(existingTasks));
    }

    // Close the modal or perform any other action as needed
    this.ftsModalService.closeModal();
  }

}

export interface Task {
  id: string;
  name: string;
  status: string;
  description: string;
  color: string;
}
