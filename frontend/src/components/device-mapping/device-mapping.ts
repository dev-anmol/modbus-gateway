import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LucideAngularModule,
  MinusCircleIcon,
  PlusCircleIcon,
} from 'lucide-angular';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { registers } from '../../models/register.type';
import { MappingService } from '../../services/mapping/mapping.service';

interface DeviceMappingRow {
  id: string;
  parameter: string;
  registerAddress: string;
  registerType: string;
  dataType: string;
  interval: string;
}

interface Device {
  id: string | null;
  deviceName: string | null;
  devicePort: string | null;
  ipAddress: string | null;
  mode: string | null;
  samplingInterval: string | null;
  timeout: string | null;
  deviceMappings?: DeviceMappingRow[];
}

@Component({
  selector: 'app-device-mapping',
  imports: [FormsModule, LucideAngularModule, ToastModule],
  templateUrl: './device-mapping.html',
  styleUrl: './device-mapping.css',
  providers: [MessageService],
})
export class DeviceMapping implements OnInit {
  readonly addIcon = PlusCircleIcon;
  readonly removeIcon = MinusCircleIcon;

  public currentDevice: Device | null = null;
  public deviceId: string | null = null;

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

  private router = inject(Router);
  private messageService = inject(MessageService);
  private mappingService = inject(MappingService);
  id = signal<any | null>(null);

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.id.set(Number(this.route.snapshot.paramMap.get('id')));
    console.log(this.id());
  }

  addRow() {
    console.log(this.rows());
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

  saveDeviceWithMappings() {
    console.log(this.rows());

    for (let row of this.rows()) {
      if (row.registerAddress === null || row.registerAddress === '') {
        this.generateToast('Please Add RegisterAddress');
        return;
      }
      if (row.dataType === null || row.dataType === '') {
        this.generateToast('Please Add DataType');
        return;
      }
      if (row.parameter === null || row.parameter === '') {
        this.generateToast('Please Add Parameter');
        return;
      }
      if (row.registerType === null || row.registerType === '') {
        this.generateToast('Please Add Register Type');
        return;
      }
    }

    if (this.currentDevice) {
      const completeDevice: Device = {
        ...this.currentDevice,
        deviceMappings: this.rows(),
      };

      const savedDevices = JSON.parse(localStorage.getItem('devices') || '[]');
      savedDevices.push(completeDevice);
      localStorage.setItem('devices', JSON.stringify(savedDevices));
      console.log('Saved device with mappings:', completeDevice);

      this.mappingService
        .createAddressMappings(this.id(), this.rows())
        .subscribe({
          next: (response) => {
            console.log(response);
          },
          error: (error) => {
            console.error('Error Creating Mappings', error);
          },
        });

      this.router.navigate(['/device']);
    }
  }

  generateToast(msg: string) {
    console.log(msg);
    this.messageService.add({
      severity: 'warn',
      summary: msg,
      detail: 'Invalid Fields',
      life: 3000,
      closable: true,
    });
  }
}
