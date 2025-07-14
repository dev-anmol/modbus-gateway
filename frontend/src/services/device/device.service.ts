import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../env/environment';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private http = inject(HttpClient);
  constructor() { }

  addDevice(data: any) {
    return this.http.post(`${environment.apiBaseUrl}`, data);
  }
}
