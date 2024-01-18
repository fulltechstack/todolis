import { TestBed } from '@angular/core/testing';

import { FtsAlertService } from './fts-alert.service';

describe('FtsAlertService', () => {
  let service: FtsAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FtsAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
