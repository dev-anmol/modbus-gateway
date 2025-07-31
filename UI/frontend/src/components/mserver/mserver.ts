import {
  Component,
  computed,
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
  public searchTerm: WritableSignal<String> = signal('');

  filteredServers = computed(() => {
    const allServers = this.serverProfile();
    const search = this.searchTerm()?.toLowerCase().trim();

    if (!search) {
      return allServers;
    }

    return allServers.filter((server) => {
      server.Name.includes(search) ||
        server.ServerPort.includes(search) ||
        server.ServerIpAddress.includes(search) ||
        server.PoolSize.includes(search);
    });
  });

  findServer(e: Event) {
    const target = e.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  clearSearch() {
    this.searchTerm.set('');
  }

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

  deleteSeverProfile(Id: Number) {
    this.mserverService.deleteServerProfile(Id).subscribe({
      next: (res) => {
        console.log(res);
        this.serverProfile.update((servers) =>
          servers.filter((server) => server.Id !== Id)
        );
      },
      error(err) {
        console.log(err);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.sub1) this.sub1.unsubscribe();
  }
}
