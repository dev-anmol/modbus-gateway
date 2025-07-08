import { Component, signal, WritableSignal } from '@angular/core';
import { registers } from '../../models/register.type';
import { FormsModule } from '@angular/forms';

interface DeviceMappingRow {
  id: string;
  parameter: string;
  registerAddress: string;
  registerType: string;
  dataType: string;
  interval: string;
}

@Component({
  selector: 'app-device-mapping',
  imports: [FormsModule],
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

  public rows = signal<DeviceMappingRow[]>([
    {
      id: '',
      parameter: '',
      registerAddress: '',
      registerType: '',
      dataType: '',
      interval: '',
    },
  ]);

  addRow() {
    this.rows.update((rows) => [
      ...rows,
      {
        id: '',
        parameter: '',
        registerAddress: '',
        registerType: '',
        dataType: '',
        interval: '',
      },
    ]);
  }

  removeRow() {
    if (this.rows().length !== 1) {
      this.rows.update((rows) => rows.slice(0, -1));
    }
  }
}
