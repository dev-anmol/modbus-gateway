import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

@Component({
  selector: 'app-modbus-server',
  imports: [ReactiveFormsModule],
  templateUrl: './modbus-server.html',
  styleUrl: './modbus-server.css',
})
export class ModbusServer {
  serverForm = new FormGroup({
    serverIpAddress: new FormControl<string | null>(null),
    serverPort: new FormControl<number | null>(null),
    poolSize: new FormControl<number | null>(null),
    unitId: new FormControl<number | null>(null),
    interval: new FormControl<number | null>(null),
  });

  handleFormData() {
    console.log(this.serverForm.value)

  }
}
