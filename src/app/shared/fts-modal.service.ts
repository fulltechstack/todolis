import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector, EmbeddedViewRef, Type } from '@angular/core';
import { FtsModalComponent } from './fts-modal/fts-modal.component';

@Injectable({
  providedIn: 'root'
})
export class FtsModalService {
  private modalComponentRef: any;
  private isModalOpen = false;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  openModal(data: any): void {
    if (!this.isModalOpen) {
      // Create a component factory for the modal component
      const modalFactory = this.componentFactoryResolver.resolveComponentFactory(FtsModalComponent);

      // Create a component instance
      this.modalComponentRef = modalFactory.create(this.injector);

      // Pass data to the modal component
      this.modalComponentRef.instance.data = data;

      // Attach the component to the appRef so that it's part of the Angular application
      this.appRef.attachView(this.modalComponentRef.hostView);

      // Get the DOM element of the modal component
      const modalElement = (this.modalComponentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

      // Append the modal element to the body
      document.body.appendChild(modalElement);

      this.isModalOpen = true;
    }
  }

  closeModal(): void {
    if (this.isModalOpen && this.modalComponentRef) {
      // Remove the modal component from the appRef and the DOM
      this.appRef.detachView(this.modalComponentRef.hostView);
      this.modalComponentRef.destroy();

      this.isModalOpen = false;
    }
  }
}
