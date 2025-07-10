import { TestBed } from '@angular/core/testing';

import { DeviceServiceTs } from './device.service.ts';

describe('DeviceServiceTs', () => {
  let service: DeviceServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
