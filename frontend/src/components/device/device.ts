import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { DeviceModel } from '../../models/device.type';
import { DeviceService } from '../../services/device/device.service';

@Component({
  selector: 'app-device',
  imports: [],
  templateUrl: './device.html',
  styleUrl: './device.css',
})
export class Device implements OnInit {
  private router = inject(Router);
  private deviceService = inject(DeviceService);
  public devices: WritableSignal<DeviceModel[]> = signal([]);
  public header: WritableSignal<String[]> = signal([
    'Id',
    'Device Name',
    'Ip Address',
    'Device Profile',
    'Mode',
  ]);

  ngOnInit(): void {
    this.deviceService.getAllDevices().subscribe({
      next: (response: DeviceModel[]) => {
        console.log(response);
        if (response) {
          this.devices.set(response);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  navigateToManageDevice(id: number) {
    this.router.navigate([`device/:${id}`]);
  }

  handleNavigation() {
    this.router.navigate(['/device/0']);
  }
}
