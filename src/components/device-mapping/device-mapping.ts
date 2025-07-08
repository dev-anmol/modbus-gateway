import { Component, signal, WritableSignal } from '@angular/core';
import { registers } from '../../models/register.type';
@Component({
  selector: 'app-device-mapping',
  imports: [],
  templateUrl: './device-mapping.html',
  styleUrl: './device-mapping.css',
})
export class DeviceMapping {
  public registers: WritableSignal<registers> = signal([
    'HOLDING_REGISTERS',
    'INPUT_REGISTERS',
    'DISCRETE_INPUTS',
    'COILS',
  ]);

  public header: WritableSignal<string[]> = signal([
    'Id',
    'Parameter',
    'Register Address',
    'Register Type',
    'Data Type',
    'Interval',
  ]);

  public dataTypes: WritableSignal<string[]> = signal([
    'BOOLEAN',
    'INT16',
    'UINT16',
    'INT32',
    'UINT32',
    'LONG',
    'FLOAT',
    'DOUBLE',
  ]);
}
