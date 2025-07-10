import { TestBed } from '@angular/core/testing';

import { MserverServiceTs } from './mserver.service.ts';

describe('MserverServiceTs', () => {
  let service: MserverServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MserverServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
