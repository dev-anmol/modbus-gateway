import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../env/environment';
import { DeviceModel } from '../../models/device.type';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private http = inject(HttpClient);

  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  constructor() {}

  addDevice(data: any) {
    return this.http.post(`${environment.apiBaseUrl}/device`, data, {
      headers: this.httpHeaders,
    });
  }

  getDeviceById(Id: number) {
    console.log(Id);
    return this.http.get<DeviceModel>(`${environment.apiBaseUrl}/device/${Id}`);
  }

  getAllDevices() {
    return this.http.get<DeviceModel[]>(`${environment.apiBaseUrl}/device`);
  }
}
