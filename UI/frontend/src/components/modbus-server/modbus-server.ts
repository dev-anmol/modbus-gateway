import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MserverService } from '../../services/mserver/mserver.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modbus-server',
  imports: [ReactiveFormsModule, ToastModule],
  templateUrl: './modbus-server.html',
  styleUrl: './modbus-server.css',
  providers: [MessageService],
})
export class ModbusServer implements OnInit, OnDestroy {
  serverForm = new FormGroup({
    serverIpAddress: new FormControl<string | null>(null),
    serverPort: new FormControl<string | null>(null),
    serverName: new FormControl<string | null>(null),
    poolSize: new FormControl<string | null>(null),
    unitId: new FormControl<string | null>(null),
    interval: new FormControl<string | null>(null),
  });

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private mserverService = inject(MserverService);
  private serverIpAddress: WritableSignal<string> = signal('Server Ip Address');
  private serverName: WritableSignal<string> = signal('Server Name');
  private serverPort: WritableSignal<string> = signal('Server Port');
  private poolSize: WritableSignal<string> = signal('Pool Size');
  private unitId: WritableSignal<string> = signal('Unit Id');
  private interval: WritableSignal<string> = signal('Interval');
  id = signal<any | null>(null);

  ngOnInit(): void {
    this.id.set(Number(this.route.snapshot.paramMap.get('id')));
    this.mserverService.getServerDetailsById(this.id()).subscribe({
      next: (res) => {
        this.serverForm.patchValue({
          unitId: res.UnitId,
          serverName: res.Name,
          serverPort: res.ServerPort,
          interval: res.Interval,
          serverIpAddress: res.ServerIpAddress,
          poolSize: res.PoolSize,
        });
      },
      error: (error) => {
        console.error(`Error while getting the data`, error);
      },
    });
  }

  onSubmit() {
    if (this.isEditMode) {
      this.updateServer();
    } else {
      this.createServer();
    }
  }

  createServer() {
    console.log(this.serverForm.value, 'and testing ng prime');
    if (
      this.serverForm.value.serverIpAddress === null ||
      this.serverForm.value.serverIpAddress === ''
    ) {
      this.generateToast(
        'Please Enter Server Ip Address',
        this.serverIpAddress
      );
    }

    if (
      this.serverForm.value.serverName === null ||
      this.serverForm.value.serverName === ''
    ) {
      this.generateToast('Please Enter Server Name', this.serverName);
    }

    if (
      this.serverForm.value.unitId === null ||
      this.serverForm.value.unitId === ''
    ) {
      this.generateToast('Please Enter the Unit Id', this.unitId);
    }

    if (
      this.serverForm.value.serverPort === null ||
      this.serverForm.value.serverPort === ''
    ) {
      this.generateToast('Please Enter the Server Port', this.serverPort);
    }

    if (
      this.serverForm.value.poolSize === null ||
      this.serverForm.value.poolSize === ''
    ) {
      this.generateToast(
        'Please Enter the Transmission Pool Size',
        this.poolSize
      );
    }

    if (
      this.serverForm.value.interval === null ||
      this.serverForm.value.interval === ''
    ) {
      this.generateToast('Please Enter the Sampling Interval', this.interval);
    }
    console.log('server data', this.serverForm.value);
    this.mserverService.createModbusServer(this.serverForm.value).subscribe({
      next: (res) => {
        console.log(res);
        this.generateSuccessToast("Server Profile Created")
        setTimeout(() => {
          this.router.navigate(['/modbus-server'])
        }, 800)
      },
      error: (error) => {
        console.error(error);
      },
    });
    this.serverForm.reset();
  }

  updateServer() {
    const server = {
      Id: this.id(),
      UnitId: this.serverForm.value.unitId,
      ServerIpAddress: this.serverForm.value.serverIpAddress,
      Name: this.serverForm.value.serverName,
      Interval: this.serverForm.value.interval,
      PoolSize: this.serverForm.value.poolSize,
      ServerPort: this.serverForm.value.serverPort,
    };

    this.mserverService.updateServerProfile(this.id(), server).subscribe({
      next: () => {
        console.log('udpated successfully');
        this.generateSuccessToast('Server Updated Successfully');
        setTimeout(() => {
          this.router.navigate(['/modbus-server'])
        }, 800)
      },
      error: (err) => {
        console.error('Error while updating');
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

  generateSuccessToast(msg: string) {
    this.messageService.add({
      severity: 'success',
      summary: msg,
      detail: msg,
      life: 3000,
      closable: true,
    });
  }

  get isEditMode() {
    return this.id() !== null && this.id() > 0;
  }

  ngOnDestroy(): void {}
}
