import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../env/environment';

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

  getAllDevices() {
    return this.http.get(`${environment.apiBaseUrl}/device`);
  }
}
