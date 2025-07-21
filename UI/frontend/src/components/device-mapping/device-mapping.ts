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

type DeviceMappingRow = {
  id?: number;
  parameter: string;
  registerAddress: string;
  registerType: string;
  dataType: string;
  interval: string;
};

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
    'Action',
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

  private router = inject(Router);
  private messageService = inject(MessageService);
  private mappingService = inject(MappingService);

  successFlag: boolean = false;
  id = signal<any | null>(null);
  public mappings = signal<DeviceMappingRow[]>([]);

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.id.set(Number(this.route.snapshot.paramMap.get('id')));
    this.getDeviceMappings();
  }

  getDeviceMappings() {
    this.mappingService.getAddressMappings(this.id()).subscribe({
      next: (res) => {
        const mapped = res.map((item: any) => ({
          id: item.Id,
          parameter: item.Parameter,
          registerAddress: item.RegisterAddress,
          registerType: item.RegisterType,
          dataType: item.DataType,
          interval: item.Interval,
        }));
        this.mappings.set(mapped);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  addRow() {
    this.mappings.update((mappings) => [
      ...mappings,
      {
        parameter: '',
        registerAddress: '',
        registerType: '',
        dataType: '',
        interval: '',
      },
    ]);
  }

  removeRow(index: number, mappingId: number | undefined) {
    console.log(mappingId);

    this.mappings.update((mappings) => {
      const newMappings = [...mappings];
      newMappings.splice(index, 1);
      return newMappings;
    });
    if (mappingId) {
      this.mappingService.deleteAddressMapping(mappingId).subscribe({
        next: (response) => {
          console.log(response);
          this.successFlag = true;
          this.generateToast('Deleted Address Mapping', this.successFlag);
        },
        error: (error) => {
          this.successFlag = false;
          console.error('Error while deleting mapping', error, error.message);
        },
      });
    }
  }

  saveDeviceWithMappings() {
    const mappings = this.mappings();

    for (let row of mappings) {
      if (
        !row.registerAddress ||
        !row.dataType ||
        !row.parameter ||
        !row.registerType
      ) {
        this.generateWarning('Please fill all required fields');
        return;
      }
    }

    const payload = mappings.map((row: any) => ({
      Id: row.id ?? null,
      parameter: row.parameter,
      registerAddress: row.registerAddress,
      registerType: row.registerType,
      dataType: row.dataType,
      interval: row.interval,
      deviceProfileId: this.id(),
    }));

    this.mappingService
      .saveOrUpdateAddressMappings(this.id(), payload)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.successFlag = true;
          this.generateToast('Device Address Mapping Added', this.successFlag);
          setTimeout(() => this.router.navigate(['/profile']), 800);
        },
        error: (error) => {
          console.error('Error Creating Mappings', error);
          this.successFlag = false;
          this.generateToast('Error Adding Mappings', this.successFlag);
        },
      });
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
