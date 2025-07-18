import {
  Component,
  inject,
  OnInit,
  WritableSignal,
  signal,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile/profile.service';
import { ProfileModel } from '../../models/profile.type';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit, OnDestroy {
  private router = inject(Router);
  private profileService = inject(ProfileService);
  public deviceProfile: WritableSignal<ProfileModel[]> = signal([]);
  public header: WritableSignal<String[]> = signal([
    'Id',
    'Profile Name',
    'Description',
    'Make',
    'Model',
  ]);
  public sub1!: Subscription;
  public sub2!: Subscription;

  ngOnInit(): void {
    this.sub1 = this.profileService.getAllDeviceProfiles().subscribe({
      next: (response: ProfileModel[]) => {
        if (response) {
          this.deviceProfile.set(response);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  deleteDeviceProfile(Id: number) {
    this.profileService.deleteDeviceProfile(Id).subscribe({
      next: (res) => {
        console.log(res);
        this.deviceProfile.update((profiles) =>
          profiles.filter((profile) => profile.Id !== Id)
        );
      },
      error: (error) => {
        console.error('Error deleting Device profile', error);
      },
    });
  }

  navigateToDeviceProfile(id: number | '' | undefined) {
    if (typeof id === 'number') {
      this.router.navigate([`/profile/${id}`]);
    } else {
      console.warn('Invalid profile id:', id);
    }
  }

  navigateToAddressMapping(id: number) {
    this.router.navigate([`/device-mapping/${id}`]);
  }

  handleNavigation() {
    this.router.navigate(['/profile/0']);
  }

  ngOnDestroy(): void {
    if (this.sub1) this.sub1.unsubscribe();
    if (this.sub2) this.sub2.unsubscribe();
  }
}
