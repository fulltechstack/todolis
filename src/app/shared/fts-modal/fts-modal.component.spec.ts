import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FtsModalComponent } from './fts-modal.component';

describe('FtsModalComponent', () => {
  let component: FtsModalComponent;
  let fixture: ComponentFixture<FtsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FtsModalComponent]
    });
    fixture = TestBed.createComponent(FtsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
