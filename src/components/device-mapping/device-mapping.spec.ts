import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceMapping } from './device-mapping';

describe('DeviceMapping', () => {
  let component: DeviceMapping;
  let fixture: ComponentFixture<DeviceMapping>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceMapping]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceMapping);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
