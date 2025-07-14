import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
export class DeviceProfile implements OnInit {
  private profileService = inject(ProfileService);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  successFlag: boolean = true;
  failureFlag: boolean = false;
  id = signal<any | null>(null);
  profileForm = new FormGroup({
    profileName: new FormControl<string>(''),
    profileMake: new FormControl<string>(''),
    profileModel: new FormControl<string>(''),
    profileDescription: new FormControl<string>(''),
  });

  ngOnInit(): void {
    this.id.set(Number(this.route.snapshot.paramMap.get('id')));
    console.log('Device Profile', this.id);
    this.profileService.getDeviceProfileById(this.id()).subscribe({
      next: (res: ProfileModel) => {
        console.log(res);
        this.profileForm.patchValue({
          profileMake: res.DeviceMake,
          profileDescription: res.ProfileDescription,
          profileModel: res.ProfileModel,
          profileName: res.ProfileName,
        });
      },
      error: (err) => {
        console.error('Error while fetching', err);
      },
    });
  }

  get isEditMode() {
    return this.id() !== null && this.id() > 0;
  }

  handleFormData() {
    const profile: ProfileModel = {
      Id: this.id(),
      ProfileName: this.profileForm.value.profileName ?? '',
      DeviceMake: this.profileForm.value.profileMake ?? '',
      ProfileModel: this.profileForm.value.profileModel ?? '',
      ProfileDescription: this.profileForm.value.profileDescription ?? '',
    };

    if (this.id() && this.id() > 0) {
      console.log(profile);
      this.profileService.updateDeviceProfile(this.id(), profile).subscribe({
        next: (response) => {
          console.log('Updated successfully', response);
          this.generateToast('Device Profile Updated', this.successFlag);
          setTimeout(() => {
            this.handleNavigation();
          }, 300);
        },
        error: (err) => {
          console.log('Updated error', err);
          this.generateToast('Error Updating Device Profile', this.failureFlag);
        },
      });
    } else {
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
  }

  generateToast(msg: string, flag: boolean) {
    this.messageService.add({
      severity: flag ? 'success' : 'error',
      summary: msg,
      life: 3000,
      closable: true,
    });
  }

  handleNavigation() {
    this.router.navigate(['/profile']);
  }
}
