import { Component, Input, ElementRef } from '@angular/core';
import { FtsModalService } from '../fts-modal.service';

@Component({
  selector: 'app-fts-modal',
  templateUrl: './fts-modal.component.html',
  styleUrls: ['./fts-modal.component.scss']
})
export class FtsModalComponent {
  @Input() data: any;
  taskContent: string = '';

  constructor(
    private ftsModalService: FtsModalService,
    private elementRef: ElementRef // Inject ElementRef
  ) { }

  closeModal(event: MouseEvent): void {
    // Get the DOM element of the modal
    const modalElement = this.elementRef.nativeElement;

    // Check if the click event target is the modal itself or any of its children
    if (modalElement.contains(event.target)) {
      this.ftsModalService.closeModal();
    }
  }

  save(): void {
    // Implement your save logic here
    // For example, you can update the data.content with the entered taskContent
    this.data.content = this.taskContent;
    // Close the modal
    this.ftsModalService.closeModal();
  }
}
