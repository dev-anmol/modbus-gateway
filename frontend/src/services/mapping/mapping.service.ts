import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../env/environment';

@Injectable({
  providedIn: 'root'
})
export class MappingService {

  private http = inject(HttpClient);

  constructor() { }

  createAddressMappings(profileId: number, mappings: any[]) {
    return this.http.post(`${environment.apiBaseUrl}/address-maps/${profileId}`, mappings);
  }
}
