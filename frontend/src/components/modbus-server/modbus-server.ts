import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-modbus-server',
  imports: [ReactiveFormsModule, ToastModule],
  templateUrl: './modbus-server.html',
  styleUrl: './modbus-server.css',
  providers: [MessageService],
})
export class ModbusServer {
  serverForm = new FormGroup({
    serverIpAddress: new FormControl<string | null>(null),
    serverPort: new FormControl<string | null>(null),
    poolSize: new FormControl<string | null>(null),
    unitId: new FormControl<string | null>(null),
    interval: new FormControl<string | null>(null),
  });

  private messageService = inject(MessageService);
  private serverIpAddress: WritableSignal<string> = signal('Server Ip Address');
  private serverPort: WritableSignal<string> = signal('Server Port');
  private poolSize: WritableSignal<string> = signal('Pool Size');
  private unitId: WritableSignal<string> = signal('Unit Id');
  private interval: WritableSignal<string> = signal('Interval');

  handleFormData() {
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
    this.serverForm.reset();
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
