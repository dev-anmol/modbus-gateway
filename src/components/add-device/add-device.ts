import { Component, inject } from '@angular/core';
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

  deviceForm = new FormGroup({
    id: new FormControl<number | null>(null),
    deviceName: new FormControl<string | null>(null),
    ipAddress: new FormControl<string | null>(null),
    mode: new FormControl<string | null>(null),
    samplingInterval: new FormControl<number | null>(null),
    timeout: new FormControl<number | null>(null),
  });

  handleFormData() {
    console.log(this.deviceForm.value, 'and testing ng prime');
    if (this.deviceForm.value.deviceName === null) {
      this.generateToast('Please Enter the Device Name');
    }

    if (this.deviceForm.value.id === null) {
      this.generateToast('Please Enter the Device Id');
    }

    if (this.deviceForm.value.ipAddress === null) {
      this.generateToast('Please Enter the IP Address');
    }

    if (this.deviceForm.value.mode === null) {
      this.generateToast('Please Enter the Transmission Mode');
    }

    if (this.deviceForm.value.samplingInterval === null) {
      this.generateToast('Please Enter the Sampling Interval');
    }
  }

  generateToast(msg: string) {
    this.messageService.add({
      severity: 'warn',
      summary: msg,
      detail: 'Invalid Fields',
      life: 3000,
      sticky: true,
      closable: true,
    });
  }
}
