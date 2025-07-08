import { Component, signal, WritableSignal } from '@angular/core';
import { registers } from '../../models/register.type';
@Component({
  selector: 'app-device-mapping',
  imports: [],
  templateUrl: './device-mapping.html',
  styleUrl: './device-mapping.css',
})
export class DeviceMapping {
  public register: WritableSignal<registers> = signal([
    'HOLDING_REGISTERS',
    'INPUT_REGISTERS',
    'DISCRETE_INPUTS',
    'COILS',
  ]);

  public header : WritableSignal<string[]> = signal([
    "id", 
    "Parameter",
    "Register Address",
    "Register Type",
    "Data Type",
    "Interval"
  ])
}
