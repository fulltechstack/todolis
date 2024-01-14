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

  selectedColor: string = 'yellow';
  isDropdownOpen: boolean = false;

  colorBackgroundMap: { [key: string]: string } = {
    purple: '#9c33d9',
    yellow: '#F7B924',
    pink: '#d83fcb'
  };

  constructor(
    private ftsModalService: FtsModalService,
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    if (!this.data.isAdd) {
      this.taskName = this.data.taskData.name;
      this.taskDescription = this.data.taskData.description;
      this.selectedColor = this.data.taskData.color; // Set selectedColor based on task color
    }
  }

  closeModal(event: MouseEvent): void {
    const modalElement = this.elementRef.nativeElement;
    if (modalElement.contains(event.target)) {
      this.ftsModalService.closeModal();
    }
  }

  save() {
    const newTask: Task = {
      id: 'taskName' + Math.random(),
      name: this.taskName,
      status: 'Rejected',
      description: this.taskDescription,
      sequence: 8,
      color: this.selectedColor // Set the task color from selectedColor
    };

    if (!this.data.isAdd && this.data.taskData) {
      newTask.id = this.data.taskData.id;
      newTask.status = this.data.taskData.status;
      newTask.sequence = this.data.taskData.sequence;
      newTask.color = this.selectedColor; // Update task color from selectedColor
    }

    const existingTasksString = localStorage.getItem('tasks');
    let existingTasks: Task[] = existingTasksString ? JSON.parse(existingTasksString) : [];

    if (!this.data.isAdd && this.data.taskData) {
      const existingIndex = existingTasks.findIndex((t: Task) => t.id === newTask.id);
      if (existingIndex !== -1) {
        existingTasks[existingIndex] = { ...existingTasks[existingIndex], ...newTask };
      }
    } else {
      newTask.sequence = existingTasks.length + 1;
      existingTasks.push(newTask);
    }

    localStorage.setItem('tasks', JSON.stringify(existingTasks));
    this.ftsModalService.notifyTaskUpdated();
    this.ftsModalService.closeModal();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectColor(color: string) {
    this.selectedColor = color; // Update the selected color
    this.isDropdownOpen = false;
  }
}
