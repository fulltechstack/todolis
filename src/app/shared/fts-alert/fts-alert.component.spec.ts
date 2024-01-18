import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FtsAlertComponent } from './fts-alert.component';

describe('FtsAlertComponent', () => {
  let component: FtsAlertComponent;
  let fixture: ComponentFixture<FtsAlertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FtsAlertComponent]
    });
    fixture = TestBed.createComponent(FtsAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
