import {
  Component,
  inject,
  OnInit,
  WritableSignal,
  signal,
  OnDestroy,
  computed,
} from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile/profile.service';
import { ProfileModel } from '../../models/profile.type';
import { Subscription } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile',
  imports: [ToastModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  providers: [MessageService],
})
export class Profile implements OnInit, OnDestroy {
  private router = inject(Router);
  private messageService = inject(MessageService);

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
  public successFlag!: boolean;
  public searchTerm: WritableSignal<string> = signal('');

  filteredProfiles = computed(() => {
    const allProfiles = this.deviceProfile();
    const search = this.searchTerm().toLowerCase().trim();

    if(!search) {
      return allProfiles;
    }

    return allProfiles.filter(profile => 
      profile.ProfileName?.toLowerCase().includes(search) ||
      profile.ProfileModel?.toLowerCase().includes(search) ||
      profile.DeviceMake?.toLowerCase().includes(search)
    )

  })

  findProfiles(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  clearSearch() {
    this.searchTerm.set('');
  }

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
    console.log("delete profile id")
    this.profileService.deleteDeviceProfile(Id).subscribe({
      next: (res) => {
        this.successFlag = true;
        this.generateToast('Device Profile Deleted', this.successFlag);
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

  generateToast(msg: string, flag: boolean) {
    console.log("toast")
    this.messageService.add({
      severity: flag ? 'success' : 'error',
      summary: msg,
      life: 3000,
      closable: true,
    });
  }

  ngOnDestroy(): void {
    if (this.sub1) this.sub1.unsubscribe();
    if (this.sub2) this.sub2.unsubscribe();
  }
}
