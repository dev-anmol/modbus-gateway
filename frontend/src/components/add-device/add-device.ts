import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProfileModel } from '../../models/profile.type';
import { DeviceService } from '../../services/device/device.service';
import { ProfileService } from '../../services/profile/profile.service';
import { Subscription } from 'rxjs';
import { DeviceModel } from '../../models/device.type';

@Component({
  selector: 'app-add-device',
  imports: [ReactiveFormsModule, ToastModule, RouterModule],
  templateUrl: './add-device.html',
  styleUrl: './add-device.css',
  providers: [MessageService],
})
export class AddDevice implements OnInit, OnDestroy {
  private messageService = inject(MessageService);
  private deviceService = inject(DeviceService);
  private profileService = inject(ProfileService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private sub1!: Subscription;
  private sub2!: Subscription;
  private sub3!: Subscription;

  private deviceName: WritableSignal<string> = signal('Device Name');
  private devicePort: WritableSignal<string> = signal('Device Port');
  private deviceId: WritableSignal<string> = signal('Device unitId');
  private samplingInterval: WritableSignal<string> =
    signal('Sampling Interval');
  private ipAddress: WritableSignal<string> = signal('Ip Address');
  private mode: WritableSignal<string> = signal('Mode');
  private devicePayload: WritableSignal<any | null> = signal(null);
  public deviceProfiles: WritableSignal<ProfileModel[] | null> = signal(null);
  id = signal<any | null>(null);

  successFlag: boolean = false;

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
    this.id.set(Number(this.route.snapshot.paramMap.get('id')));
    this.fetchDevice();
    this.fetchAllDeviceProfiles();
  }

  get isEditMode() {
    return this.id() !== null && this.id() > 0;
  }

  updateDevice() {
    const device: DeviceModel = {
      Id: this.id(),
      DeviceProfileId: this.deviceForm.value.deviceProfileId ?? 0,
      IPAddress: this.deviceForm.value.ipAddress ?? '',
      Mode: this.deviceForm.value.mode ?? '',
      Name: this.deviceForm.value.deviceName ?? '',
      Port: this.deviceForm.value.devicePort ?? '',
      SamplingInterval: this.deviceForm.value.samplingInterval ?? '',
      Timeout: this.deviceForm.value.timeout ?? '',
      UnitId: this.deviceForm.value.unitId ?? '',
    };
    this.sub3 = this.deviceService.updateDevice(this.id(), device).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  onSubmit() {
    if (this.isEditMode) {
      this.updateDevice();
    } else {
      this.createDevice();
    }
  }

  createDevice() {
    if (
      this.deviceForm.value.deviceName === null ||
      this.deviceForm.value.deviceName === ''
    ) {
      this.generateWarningToast(
        'Please Enter the Device Name',
        this.deviceName
      );
    }

    if (
      this.deviceForm.value.devicePort === null ||
      this.deviceForm.value.devicePort === ''
    ) {
      this.generateWarningToast(
        'Please Enter the Device Port',
        this.devicePort
      );
    }

    if (
      this.deviceForm.value.unitId === null ||
      this.deviceForm.value.unitId === ''
    ) {
      this.generateWarningToast(
        'Please Enter the Device unitId',
        this.deviceId
      );
    }

    if (
      this.deviceForm.value.ipAddress === null ||
      this.deviceForm.value.ipAddress === ''
    ) {
      this.generateWarningToast('Please Enter the IP Address', this.ipAddress);
    }

    if (
      this.deviceForm.value.mode === null ||
      this.deviceForm.value.mode === ''
    ) {
      this.generateWarningToast(
        'Please Enter the Transmission Mode',
        this.mode
      );
    }

    if (
      this.deviceForm.value.samplingInterval === null ||
      this.deviceForm.value.samplingInterval === ''
    ) {
      this.generateWarningToast(
        'Please Enter the Sampling Interval',
        this.samplingInterval
      );
    }

    this.devicePayload.set(this.deviceForm.value);
    this.deviceService.addDevice(this.deviceForm.value).subscribe({
      next: (response) => {
        this.successFlag = true;
        this.generateToast('Device Added Succesfully', this.successFlag);

        setTimeout(() => {
          this.router.navigate(['/device']);
        }, 800);
        this.deviceForm.reset();
      },
      error: (err) => {
        this.successFlag = false;
        this.generateToast('Error Adding Device', this.successFlag);
        console.error('Error Adding Device', err);
      },
    });
  }

  fetchAllDeviceProfiles() {
    this.sub1 = this.profileService.getAllDeviceProfiles().subscribe({
      next: (response) => {
        this.deviceProfiles.set(response);
        console.log(this.deviceProfiles());
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  fetchDevice() {
    this.sub2 = this.deviceService.getDeviceById(this.id()).subscribe({
      next: (res: DeviceModel) => {
        console.log(res);
        this.deviceForm.patchValue({
          unitId: res.UnitId,
          deviceName: res.Name,
          deviceProfileId: res.DeviceProfileId,
          ipAddress: res.IPAddress,
          devicePort: res.Port,
          mode: res.Mode,
          samplingInterval: res.SamplingInterval,
          timeout: res.Timeout,
        });
      },
      error: (error) => {
        console.error('Error getting Device', error);
      },
    });
  }

  generateWarningToast(msg: string, key: WritableSignal<string>) {
    this.messageService.add({
      key: key(),
      severity: 'warn',
      summary: msg,
      detail: 'Invalid Fields',
      life: 3000,
      closable: true,
    });
  }

  generateToast(msg: string, flag: boolean) {
    this.messageService.add({
      severity: flag ? 'success' : 'warn',
      summary: msg,
      life: 3000,
      closable: true,
    });
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }
}
