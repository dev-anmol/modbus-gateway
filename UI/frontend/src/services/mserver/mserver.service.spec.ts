import { TestBed } from '@angular/core/testing';

import { MserverService } from './mserver.service';

describe('MserverService', () => {
  let service: MserverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MserverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
