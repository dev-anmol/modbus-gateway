import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../env/environment';

@Injectable({
  providedIn: 'root',
})
export class MserverService {
  private http = inject(HttpClient);
  private httpHeaders = new HttpHeaders({
    'Content-type': 'application/json',
  });

  constructor() {}

  createModbusServer(server: any) {
    return this.http.post(`${environment.apiBaseUrl}/mserver`, server, {
      headers: this.httpHeaders,
    });
  }

  getServerDetails() {
    return this.http.get<String[]>(`${environment.apiBaseUrl}/mserver`);
  }

  getServerDetailsById(id: number) {
    return this.http.get<any>(`${environment.apiBaseUrl}/mserver/${id}`);
  }

  updateServerProfile(id: number, server: any) {
    return this.http.post(`${environment.apiBaseUrl}/mserver/${id}`, server, {
      headers: this.httpHeaders,
    });
  }

  deleteServerProfile(id: Number) {
    return this.http.delete(`${environment.apiBaseUrl}/mserver/${id}`);
  }
}
