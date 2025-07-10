import { TestBed } from '@angular/core/testing';

import { ProfileServiceTs } from './profile.service.ts';

describe('ProfileServiceTs', () => {
  let service: ProfileServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
