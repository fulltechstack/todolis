import { Component } from '@angular/core';
import { FtsModalService } from '../shared/fts-modal.service';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent {

  tasks = [
    { id: 'task1', name: 'Call Sam For payments', status: 'Rejected', createdBy: 'Bob', color: 'bg-yellow' },
    { id: 'task2', name: 'Make payment to Bluedart', status: 'New', createdBy: 'Johnny', color: 'bg-purple' },
    { id: 'task3', name: 'Office rent', status: 'In Progress', createdBy: 'Samino!', color: 'bg-pink' },
    { id: 'task4', name: 'Office grocery shopping', status: 'Completed', createdBy: 'Tida', color: 'bg-yellow' },
    { id: 'task5', name: 'Ask for Lunch to Clients', status: 'In Progress', createdBy: 'Office Admin', color: 'bg-pink' },
    { id: 'task6', name: 'Client Meeting at 11 AM', status: 'Pending', createdBy: 'CEO', color: 'bg-yellow' },
    { id: 'task1', name: 'Call Sam For payments', status: 'Rejected', createdBy: 'Bob', color: 'bg-yellow' },
    { id: 'task2', name: 'Make payment to Bluedart', status: 'New', createdBy: 'Johnny', color: 'bg-purple' },
    { id: 'task3', name: 'Office rent', status: 'In Progress', createdBy: 'Samino!', color: 'bg-pink' },
    { id: 'task4', name: 'Office grocery shopping', status: 'Completed', createdBy: 'Tida', color: 'bg-yellow' },
  ];

  constructor(private ftsModalService: FtsModalService) { }

  addTask() {
    const data = {
      title: 'Fts Modal Title',
      content: 'This is the content of the Fts modal.',
      isAdd: true
    };
    this.ftsModalService.openModal(data);
  }

  editTask() {
    const data = {
      title: 'Fts Modal Title',
      content: 'This is the content of the Fts modal.',
      isAdd: false
    };
    this.ftsModalService.openModal(data);
  }
}
