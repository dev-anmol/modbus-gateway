import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProfileModel } from '../../models/profile.type';
import { DeviceService } from '../../services/device/device.service';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  selector: 'app-add-device',
  imports: [ReactiveFormsModule, ToastModule, RouterModule],
  templateUrl: './add-device.html',
  styleUrl: './add-device.css',
  providers: [MessageService],
})
export class AddDevice implements OnInit {
  private messageService = inject(MessageService);
  private deviceService = inject(DeviceService);
  private profileService = inject(ProfileService);

  private deviceName: WritableSignal<string> = signal('Device Name');
  private devicePort: WritableSignal<string> = signal('Device Port');
  private deviceId: WritableSignal<string> = signal('Device unitId');
  private samplingInterval: WritableSignal<string> = signal('Sampling Interval');
  private ipAddress: WritableSignal<string> = signal('Ip Address');
  private mode: WritableSignal<string> = signal('Mode');
  private devicePayload: WritableSignal<any | null> = signal(null);
  public deviceProfiles: WritableSignal<ProfileModel[] | null> = signal(null);

  deviceForm = new FormGroup({
    unitId: new FormControl<string | null>(null),
    deviceName: new FormControl<string | null>(null),
    devicePort: new FormControl<string | null>(null),
    deviceProfileId: new FormControl<number | null>(null),
    ipAddress: new FormControl<string | null>(null),
    mode: new FormControl<string | null>(null),
    samplingInterval: new FormControl<string | null>(null),
    timeout: new FormControl<string | null>(null),
  });

  ngOnInit(): void {
    this.fetchAllDeviceProfiles();
  }

  handleFormData() {
    if (
      this.deviceForm.value.deviceName === null ||
      this.deviceForm.value.deviceName === ''
    ) {
      this.generateToast('Please Enter the Device Name', this.deviceName);
    }

    if (
      this.deviceForm.value.devicePort === null ||
      this.deviceForm.value.devicePort === ''
    ) {
      this.generateToast('Please Enter the Device Port', this.devicePort);
    }

    if (this.deviceForm.value.unitId === null || this.deviceForm.value.unitId === '') {
      this.generateToast('Please Enter the Device unitId', this.deviceId);
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
      this.generateToast(
        'Please Enter the Sampling Interval',
        this.samplingInterval
      );
    }

    this.devicePayload.set(this.deviceForm.value);
    console.log(this.devicePayload());
    this.deviceService.addDevice(this.deviceForm.value).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.error('Error Adding Device', err);
      },
    });

    this.deviceForm.reset();
  }

  fetchAllDeviceProfiles() {
    this.profileService.getAllDeviceProfiles().subscribe({
      next: (response) => {
        this.deviceProfiles.set(response);
        console.log(this.deviceProfiles());
      },
      error: (error) => {
        console.error(error);
      },
    });
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
