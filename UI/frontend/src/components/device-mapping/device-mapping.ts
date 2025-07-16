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

  successFlag: boolean = false;
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
        this.generateWarning('Please Add RegisterAddress');
        return;
      }
      if (row.dataType === null || row.dataType === '') {
        this.generateWarning('Please Add DataType');
        return;
      }
      if (row.parameter === null || row.parameter === '') {
        this.generateWarning('Please Add Parameter');
        return;
      }
      if (row.registerType === null || row.registerType === '') {
        this.generateWarning('Please Add Register Type');
        return;
      }
    }

    this.mappingService
      .createAddressMappings(this.id(), this.rows())
      .subscribe({
        next: (response) => {
          console.log(response);
          this.successFlag = true;
          this.generateToast('Device Address Mapping Added', this.successFlag);
        },
        error: (error) => {
          console.error('Error Creating Mappings', error);
          this.successFlag = false;
          this.generateToast('Error Adding Mappings', this.successFlag);
        },
      });

    setTimeout(() => {
      this.router.navigate(['/device']);
    }, 800);
  }

  generateToast(msg: string, flag: boolean) {
    this.messageService.add({
      severity: flag ? 'success' : 'error',
      summary: msg,
      detail: 'Invalid Fields',
      life: 3000,
      closable: true,
    });
  }

  generateWarning(msg: string) {
    this.messageService.add({
      severity: 'warn',
      summary: msg,
      detail: 'Invalid Fields',
      life: 3000,
      closable: true,
    });
  }
}
