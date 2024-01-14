import { Component, Input, ElementRef } from '@angular/core';
import { FtsModalService } from '../fts-modal.service';
import { Task } from '../models/task.model';

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

  save() {
    // Create a new task object based on the form data
    const newTask: Task = {
      id: 'taskName' + Math.random(),
      name: this.taskName,
      status: 'Rejected',
      description: this.taskDescription,
      sequence: 8,
      color: 'bg-yellow'
    };

    // If it's an edit operation, update the newTask with existing data
    if (!this.data.isAdd && this.data.taskData) {
      newTask.id = this.data.taskData.id;
      newTask.status = this.data.taskData.status;
      newTask.sequence = this.data.taskData.sequence;
      newTask.color = this.data.taskData.color;
    }

    // Get existing tasks from localStorage (if any)
    const existingTasksString = localStorage.getItem('tasks');
    let existingTasks: Task[] = existingTasksString ? JSON.parse(existingTasksString) : [];

    if (!this.data.isAdd && this.data.taskData) {
      // If it's an edit operation, find and update the existing task
      const existingIndex = existingTasks.findIndex((t: Task) => t.id === newTask.id);
      if (existingIndex !== -1) {
        existingTasks[existingIndex] = { ...existingTasks[existingIndex], ...newTask };
      }
    } else {
      // If it's not an edit operation, generate a new sequence and add the task
      newTask.sequence = existingTasks.length + 1;
      existingTasks.push(newTask);
    }

    // Save the updated tasks array back to localStorage
    localStorage.setItem('tasks', JSON.stringify(existingTasks));

    this.ftsModalService.notifyTaskUpdated();

    // Close the modal or perform any other action as needed
    this.ftsModalService.closeModal();
  }


}
