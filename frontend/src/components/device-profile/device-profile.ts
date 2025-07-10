import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-device-profile',
  imports: [ReactiveFormsModule, ToastModule, RouterModule],
  templateUrl: './device-profile.html',
  styleUrl: './device-profile.css',
  providers: [MessageService],
})
export class DeviceProfile {
  profileForm = new FormGroup({
    profileName: new FormControl<string | null>(null),
    profileMake: new FormControl<string | null>(null),
    profileModel: new FormControl<string | null>(null),
    profileDescription: new FormControl<string | null>(null),
  });

  handleFormData() {}
}
