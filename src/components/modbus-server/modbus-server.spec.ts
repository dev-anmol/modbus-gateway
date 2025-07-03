import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModbusServer } from './modbus-server';

describe('ModbusServer', () => {
  let component: ModbusServer;
  let fixture: ComponentFixture<ModbusServer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModbusServer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModbusServer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
