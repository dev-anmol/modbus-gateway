import { TestBed } from '@angular/core/testing';

import { MappingServiceTs } from './mapping.service.ts';

describe('MappingServiceTs', () => {
  let service: MappingServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MappingServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
