import { Component, Input, ElementRef, HostListener, Renderer2 } from '@angular/core';
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

  selectedDate!: string;
  selectedColor: string = 'yellow';
  selectedPriority: number = 1;
  isDropdownOpen: boolean = false;
  isPriorityDropdownOpen: boolean = false;

  colorBackgroundMap: { [key: string]: string } = {
    purple: '#9c33d9',
    yellow: '#F7B924',
    pink: '#d83fcb'
  };

  priorityColorMap: { [key: string]: string } = {
    1: '#B6E2A1',
    2: '#F7B924',
    3: '#FF7878'
  };

  constructor(
    private ftsModalService: FtsModalService,
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    if (!this.data?.isAdd) {
      this.taskName = this.data.taskData.name;
      this.taskDescription = this.data.taskData.description;
      this.selectedColor = this.data.taskData.color;
      this.selectedPriority = this.data.taskData.priority;
      this.selectedDate = this.data.taskData.dueDate;
    }
    // Set the selectedDate to today's date
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to month because it's zero-based
    const day = currentDate.getDate().toString().padStart(2, '0');
    this.selectedDate = this.data?.taskData?.duedate || `${year}-${month}-${day}`;
  }

  closeModal(event: MouseEvent): void {
    const modalElement = this.elementRef.nativeElement;
    if (modalElement.contains(event.target)) {
      this.ftsModalService.closeModal();
    }
  }

  save() {
    if (!this.taskName) {
      this.taskName = 'New Task';
    }

    if (!this.taskDescription) {
      this.taskDescription = 'Drink plenty of water';
    }

    const newTask: Task = {
      id: 'taskName' + Math.random(),
      name: this.taskName,
      duedate: this.selectedDate,
      description: this.taskDescription,
      sequence: 1, // Set the sequence for new tasks to 1
      color: this.selectedColor,
      priority: this.selectedPriority,
      isComplete: false
    };

    if (!this.data.isAdd && this.data.taskData) {
      newTask.id = this.data.taskData.id;
      newTask.duedate = this.selectedDate;
      newTask.sequence = this.data.taskData.sequence;
      newTask.color = this.selectedColor;
      newTask.priority = this.selectedPriority;
    }

    const existingTasksString = localStorage.getItem('tasks');
    let existingTasks: Task[] = existingTasksString ? JSON.parse(existingTasksString) : [];

    if (!this.data.isAdd && this.data.taskData) {
      const existingIndex = existingTasks.findIndex((t: Task) => t.id === newTask.id);
      if (existingIndex !== -1) {
        existingTasks[existingIndex] = { ...existingTasks[existingIndex], ...newTask };
      }
    } else {
      // Increment the sequence for all existing tasks
      existingTasks.forEach(task => {
        task.sequence++;
      });

      existingTasks.unshift(newTask); // Add the new task at the beginning of the array
    }

    localStorage.setItem('tasks', JSON.stringify(existingTasks));
    this.ftsModalService.notifyTaskUpdated();
    this.ftsModalService.closeModal();
  }


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  togglePriorityDropdown() {
    this.isPriorityDropdownOpen = !this.isPriorityDropdownOpen;
  }

  selectColor(color: string) {
    this.selectedColor = color;
    this.isDropdownOpen = false;
  }

  selectPriority(priority: number) {
    this.selectedPriority = priority;
    this.isPriorityDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Check if the click is outside of both dropdowns
    const target = event.target as HTMLElement;
    const className = target.className;
    if (className.includes("color-dropdown-btn")) {
      this.isPriorityDropdownOpen = false;
      return;
    }
    if (className.includes("priority-dropdown-btn")) {
      this.isDropdownOpen = false;
      return;
    }
    const dropdownElement = this.elementRef.nativeElement.querySelector('.fts-dropdown-item');
    const priorityDropdownElement = this.elementRef.nativeElement.querySelector('.fts-dropdown-item');

    if (
      !dropdownElement.contains(event.target) ||
      !priorityDropdownElement.contains(event.target)
    ) {
      this.isDropdownOpen = false;
      this.isPriorityDropdownOpen = false;
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.ftsModalService.closeModal();
    }
  }
}
