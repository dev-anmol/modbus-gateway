import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { MserverService } from '../../services/mserver/mserver.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mserver',
  imports: [],
  templateUrl: './mserver.html',
  styleUrl: './mserver.css',
})

export class Mserver implements OnInit, OnDestroy {
  private router = inject(Router);
  private mserverService = inject(MserverService);
  public serverProfile: WritableSignal<any[]> = signal([]);
  public header: WritableSignal<String[]> = signal([
    'Id',
    'Server Name',
    'Ip Address',
    'Port',
    'Pool Size',
  ]);
  public sub1!: Subscription;

  ngOnInit(): void {
    this.sub1 = this.mserverService.getServerDetails().subscribe({
      next: (res) => {
        console.log(res);
        this.serverProfile.set(res);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  handleNavigation(id: Number) {
    console.log(id);
    this.router.navigate([`modbus-server/${id}`]);
  }

  ngOnDestroy(): void {
    if (this.sub1) this.sub1.unsubscribe();
  }
}
