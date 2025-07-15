import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../env/environment';

@Injectable({
  providedIn: 'root'
})
export class MserverService {

  private http = inject(HttpClient);
  private httpHeaders = new HttpHeaders({
    'Content-type' : 'application/json'
  }) 

  constructor() { }

  createModbusServer(server : any) {
    this.http.post(`${environment.apiBaseUrl}/server`, server, {
      headers: this.httpHeaders
    })
  }

  
}
