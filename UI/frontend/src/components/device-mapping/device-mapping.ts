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
  registerAddress: string | number;
  registerType: string;
  dataType: string;
  interval: string | number;
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

  // FIXED: Base data types (not used directly in template anymore)
  public allDataTypes: WritableSignal<string[]> = signal([
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
        console.log('Initial response', res);
        const mapped = res.map((item: any) => ({
          id: item.Id,
          parameter: item.Parameter,
          registerAddress: String(item.RegisterAddress || ''), // FIXED: Convert to string
          registerType: item.RegisterType,
          dataType: item.DataType,
          interval: String(item.Interval || ''), // FIXED: Convert to string
        }));
        this.mappings.set(mapped);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  

  // FIXED: Dynamic data types based on register selection
  getAvailableDataTypes(
    registerType: string
  ): Array<{ value: string; label: string }> {
    switch (registerType?.toUpperCase()) {
      case 'COILS':
      case 'DISCRETE_INPUTS':
        return [{ value: 'BOOLEAN', label: 'Boolean' }];

      case 'HOLDING_REGISTERS':
      case 'INPUT_REGISTERS':
        return [
          { value: 'INT16', label: 'Integer 16-bit' },
          { value: 'UINT16', label: 'Unsigned Integer 16-bit' },
          { value: 'INT32', label: 'Integer 32-bit' },
          { value: 'UINT32', label: 'Unsigned Integer 32-bit' },
          { value: 'LONG', label: 'Long' },
          { value: 'FLOAT', label: 'Float' },
          { value: 'DOUBLE', label: 'Double' },
        ];

      default:
        return [];
    }
  }

  // FIXED: Auto-set data type when register type changes
  onRegisterTypeChange(mapping: DeviceMappingRow, index: number) {
    const availableTypes = this.getAvailableDataTypes(mapping.registerType);
    if (availableTypes.length > 0) {
      // Auto-select the first valid data type
      mapping.dataType = availableTypes[0].value;

      // Update the signal to trigger change detection
      this.mappings.update((mappings) => {
        const newMappings = [...mappings];
        newMappings[index] = { ...mapping };
        return newMappings;
      });
    }
  }

  // FIXED: Validation for register type and data type combination
  private isValidCombination(registerType: string, dataType: string): boolean {
    const coilTypes = ['COILS', 'DISCRETE_INPUTS'];
    const registerTypes = ['HOLDING_REGISTERS', 'INPUT_REGISTERS'];

    if (coilTypes.includes(registerType?.toUpperCase())) {
      return dataType?.toUpperCase() === 'BOOLEAN';
    }

    if (registerTypes.includes(registerType?.toUpperCase())) {
      return [
        'INT16',
        'INT32',
        'UINT16',
        'UINT32',
        'LONG',
        'FLOAT',
        'DOUBLE',
      ].includes(dataType?.toUpperCase());
    }

    return false;
  }

  // private validateMapping(mapping: DeviceMappingRow): { isValid: boolean; errors: string[] } {
  //   const errors: string[] = [];

  //   if (!mapping.parameter?.trim()) {
  //     errors.push('Parameter is required');
  //   }

  //   if (!mapping.registerAddress?.trim()) {
  //     errors.push('Register Address is required');
  //   } else if (isNaN(Number(mapping.registerAddress))) {
  //     errors.push('Register Address must be a number');
  //   }

  //   if (!mapping.registerType) {
  //     errors.push('Register Type is required');
  //   }

  //   if (!mapping.dataType) {
  //     errors.push('Data Type is required');
  //   }

  //   if (!mapping.interval?.trim()) {
  //     errors.push('Interval is required');
  //   } else if (isNaN(Number(mapping.interval))) {
  //     errors.push('Interval must be a number');
  //   }

  //   // Check valid combination
  //   if (mapping.registerType && mapping.dataType &&
  //       !this.isValidCombination(mapping.registerType, mapping.dataType)) {
  //     errors.push(`Invalid combination: ${mapping.registerType} with ${mapping.dataType}`);
  //   }

  //   return { isValid: errors.length === 0, errors };
  // }

  private validateMapping(mapping: DeviceMappingRow): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!mapping.parameter?.trim()) {
      errors.push('Parameter is required');
    }

    // FIXED: Handle both string and number for registerAddress
    const registerAddressStr = String(mapping.registerAddress || '').trim();
    if (!registerAddressStr) {
      errors.push('Register Address is required');
    } else if (isNaN(Number(registerAddressStr))) {
      errors.push('Register Address must be a number');
    }

    if (!mapping.registerType) {
      errors.push('Register Type is required');
    }

    if (!mapping.dataType) {
      errors.push('Data Type is required');
    }

    // FIXED: Handle both string and number for interval
    const intervalStr = String(mapping.interval || '').trim();
    if (!intervalStr) {
      errors.push('Interval is required');
    } else if (isNaN(Number(intervalStr))) {
      errors.push('Interval must be a number');
    }

    // Check valid combination
    if (
      mapping.registerType &&
      mapping.dataType &&
      !this.isValidCombination(mapping.registerType, mapping.dataType)
    ) {
      errors.push(
        `Invalid combination: ${mapping.registerType} with ${mapping.dataType}`
      );
    }

    return { isValid: errors.length === 0, errors };
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
    console.log(mappings);

    const validationErrors: string[] = [];
    let hasErrors = false;

    for (let i = 0; i < mappings.length; i++) {
      const validation = this.validateMapping(mappings[i]);
      if (!validation.isValid) {
        hasErrors = true;
        validationErrors.push(`Row ${i + 1}: ${validation.errors.join(', ')}`);
      }
    }

    if (hasErrors) {
      this.generateWarning(
        'Validation Errors:\n' + validationErrors.join('\n')
      );
      return;
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

    console.log('final payload', payload);

    this.mappingService
      .saveOrUpdateAddressMappings(this.id(), payload)
      .subscribe({
        next: (response) => {
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
      detail: flag ? 'Success' : 'Error occurred',
      life: 3000,
      closable: true,
    });
  }

  generateWarning(msg: string) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Validation Warning',
      detail: msg,
      life: 5000,
      closable: true,
    });
  }
}
