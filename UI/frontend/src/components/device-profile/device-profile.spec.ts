import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceProfile } from './device-profile';

describe('DeviceProfile', () => {
  let component: DeviceProfile;
  let fixture: ComponentFixture<DeviceProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
