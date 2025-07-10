import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {

  private router = inject(Router);



  handleNavigation() {
    this.router.navigate(['/profile/0']);
  }

}
