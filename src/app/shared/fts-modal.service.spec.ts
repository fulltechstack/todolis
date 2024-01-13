import { TestBed } from '@angular/core/testing';

import { FtsModalService } from './fts-modal.service';

describe('FtsModalService', () => {
  let service: FtsModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FtsModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
