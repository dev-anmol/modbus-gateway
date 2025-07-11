import { Component, inject, OnInit, WritableSignal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile/profile.service';
import { ProfileModel } from '../../models/profile.type';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  private router = inject(Router);
  private profileService = inject(ProfileService);
  public deviceProfile: WritableSignal<ProfileModel[]> = signal([]);
  public header: WritableSignal<String []> = signal([
    "Id", "Profile Name", "Description", "Make", "Model"
  ])


  ngOnInit(): void {
    this.profileService.getAllDeviceProfiles().subscribe({
      next: (response: ProfileModel[]) => {
        console.log(response);
        if(response) {
          this.deviceProfile.set(response);
        }
      },
      error: (error) => {
        console.log(error);
      }
    })
     
  }



  handleNavigation() {
    this.router.navigate(['/profile/0']);
  }

}
