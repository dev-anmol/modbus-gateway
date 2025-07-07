import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-add-device',
  imports: [ReactiveFormsModule, ToastModule],
  templateUrl: './add-device.html',
  styleUrl: './add-device.css',
  providers: [MessageService],
})
export class AddDevice {
  private messageService = inject(MessageService);

  private deviceName : WritableSignal<string> = signal('Device Name');
  private deviceId : WritableSignal<string> = signal('Device Id');
  private samplingInterval : WritableSignal<string> = signal('Sampling Interval');
  private ipAddress : WritableSignal<string> = signal('Ip Address');
  private mode : WritableSignal<string> = signal('Mode');

  deviceForm = new FormGroup({
    id: new FormControl<string | null>(null),
    deviceName: new FormControl<string | null>(null),
    ipAddress: new FormControl<string | null>(null),
    mode: new FormControl<string | null>(null),
    samplingInterval: new FormControl<string | null>(null),
    timeout: new FormControl<string | null>(null),
  });

  handleFormData() {
    console.log(this.deviceForm.value, 'and testing ng prime');
    if (
      this.deviceForm.value.deviceName === null ||
      this.deviceForm.value.deviceName === ''
    ) {
      this.generateToast('Please Enter the Device Name', this.deviceName);
    }

    if (this.deviceForm.value.id === null || this.deviceForm.value.id === '') {
      this.generateToast('Please Enter the Device Id', this.deviceId);
    }

    if (
      this.deviceForm.value.ipAddress === null ||
      this.deviceForm.value.ipAddress === ''
    ) {
      this.generateToast('Please Enter the IP Address', this.ipAddress);
    }

    if (
      this.deviceForm.value.mode === null ||
      this.deviceForm.value.mode === ''
    ) {
      this.generateToast('Please Enter the Transmission Mode', this.mode);
    }

    if (
      this.deviceForm.value.samplingInterval === null ||
      this.deviceForm.value.samplingInterval === ''
    ) {
      this.generateToast('Please Enter the Sampling Interval', this.samplingInterval);
    }
  }

  generateToast(msg: string, key: WritableSignal<string>) {
    this.messageService.add({
      severity: 'warn',
      summary: msg,
      detail: 'Invalid Fields',
      life: 3000,
      closable: true,
    });
  }
}
