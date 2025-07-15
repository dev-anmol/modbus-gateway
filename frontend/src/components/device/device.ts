import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceService } from '../../services/device/device.service';

@Component({
  selector: 'app-device',
  imports: [],
  templateUrl: './device.html',
  styleUrl: './device.css',
})
export class Device {
  private router = inject(Router);
  private deviceService = inject(DeviceService);

  // ngOnInit(): void {
  //   this.deviceService.getAllDevices().subscribe({
  //     next: (res) => {
  //       console.log("all devices --->", res);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //   });
  // }

  handleNavigation() {
    this.router.navigate(['/device/0']);
  }
}
