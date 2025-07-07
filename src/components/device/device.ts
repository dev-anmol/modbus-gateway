import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-device',
  imports: [],
  templateUrl: './device.html',
  styleUrl: './device.css'
})
export class Device {

  private router = inject(Router);

  
  handleNavigation() {
    console.log("triggered")
    this.router.navigate(['/device/1'])

  }
}
