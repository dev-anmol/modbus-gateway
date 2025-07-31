import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
  computed,
} from '@angular/core';
import { Router } from '@angular/router';
import { DeviceModel } from '../../models/device.type';
import { DeviceService } from '../../services/device/device.service';
import { Subscription } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-device',
  imports: [ToastModule],
  templateUrl: './device.html',
  styleUrl: './device.css',
  providers: [MessageService],
})
export class Device implements OnInit, OnDestroy {
  private router = inject(Router);
  private deviceService = inject(DeviceService);
  private messageService = inject(MessageService);
  public devices: WritableSignal<DeviceModel[]> = signal([]);
  public searchTerm: WritableSignal<string> = signal('');
  
  public filteredDevices = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    const allDevices = this.devices();
    
    if (!search) {
      return allDevices;
    }
    
    return allDevices.filter(device => 
      device.Name?.toLowerCase().includes(search) ||
      device.IPAddress?.toLowerCase().includes(search) ||
      device.DeviceProfileId?.toString().includes(search) ||
      device.Mode?.toLowerCase().includes(search)
    );
  });

  public header: WritableSignal<String[]> = signal([
    'Id',
    'Device Name',
    'Ip Address',
    'Device Profile',
    'Mode',
  ]);
  public sub1!: Subscription;
  public sub2!: Subscription;

  ngOnInit(): void {
    this.sub1 = this.deviceService.getAllDevices().subscribe({
      next: (response: DeviceModel[]) => {
        if (response) {
          this.devices.set(response);
        }
      },
      error: (err) => {
        console.log('Error While Fetching Devices', err);
      },
    });
  }

  findDevices(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  clearSearch() {
    this.searchTerm.set('');
  }

  navigateToManageDevice(id: number) {
    this.router.navigate([`device/${id}`]);
  }

  handleNavigation() {
    this.router.navigate(['/device/0']);
  }

  deleteDevice(Id: number) {
    this.sub2 = this.deviceService.deleteDevice(Id).subscribe({
      next: (res) => {
        this.devices.update((devices) =>
          devices.filter((device) => device.Id !== Id)
        );

        this.generateToast('Device Deleted Successfully');
      },
      error: (error) => {
        console.error('Error while deleting', error);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
  }

  generateToast(msg: string) {
    this.messageService.add({
      severity: 'success',
      life: 3000,
      closable: true,
      data: msg,
    });
  }
}
