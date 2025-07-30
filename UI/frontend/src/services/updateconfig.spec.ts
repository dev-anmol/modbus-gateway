import { TestBed } from '@angular/core/testing';

import { Updateconfig } from './updateconfig';

describe('Updateconfig', () => {
  let service: Updateconfig;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Updateconfig);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
