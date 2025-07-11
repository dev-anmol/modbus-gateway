import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProfileModel } from '../../models/profile.type';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  selector: 'app-device-profile',
  imports: [ReactiveFormsModule, ToastModule, RouterModule],
  templateUrl: './device-profile.html',
  styleUrl: './device-profile.css',
  providers: [MessageService],
})
export class DeviceProfile {
  private profileService = inject(ProfileService);
  private messageService = inject(MessageService);
  successFlag: boolean = true;
  failureFlag: boolean = false;
  profileForm = new FormGroup({
    profileName: new FormControl<string>(''),
    profileMake: new FormControl<string>(''),
    profileModel: new FormControl<string>(''),
    profileDescription: new FormControl<string>(''),
  });

  handleFormData() {
    const profile: ProfileModel = {
      ProfileName: this.profileForm.value.profileName ?? '',
      DeviceMake: this.profileForm.value.profileMake ?? '',
      ProfileModel: this.profileForm.value.profileModel ?? '',
      ProfileDescription: this.profileForm.value.profileDescription ?? '',
    };

    this.profileService.createDeviceProfile(profile).subscribe({
      next: (response) => {
        console.log(response);
        this.generateToast('Device Profile Created', this.successFlag);
      },
      error: (err) => {
        console.log(err);
        this.generateToast('Error Creating Device Profile', this.failureFlag);
      },
    });
  }

  generateToast(msg: string, flag: boolean) {
    this.messageService.add({
      severity: flag ? 'success' : 'error',
      summary: msg,
      life: 3000,
      closable: true,
    });
  }
}
