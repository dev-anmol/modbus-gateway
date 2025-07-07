import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-add-device',
  imports: [ReactiveFormsModule],
  templateUrl: './add-device.html',
  styleUrl: './add-device.css'
})
export class AddDevice {

  deviceForm = new FormGroup({
    id: new FormControl(),
    deviceName: new FormControl(''),
    ipAddress: new FormControl(''),
    mode: new FormControl(''),
    samplingInterval: new FormControl<number | null>(null),
    timeout: new FormControl<number | null>(null)
  });


  handleFormData() {
    console.log(this.deviceForm.value)
  }

}
