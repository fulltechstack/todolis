import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedTasksBoardComponent } from './completed-tasks-board.component';

describe('CompletedTasksBoardComponent', () => {
  let component: CompletedTasksBoardComponent;
  let fixture: ComponentFixture<CompletedTasksBoardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompletedTasksBoardComponent]
    });
    fixture = TestBed.createComponent(CompletedTasksBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
