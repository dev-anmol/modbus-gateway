import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../env/environment';

@Injectable({
  providedIn: 'root',
})
export class MappingService {
  private http = inject(HttpClient);

  constructor() {}

  saveOrUpdateAddressMappings(profileId: number, mappings: any[]) {
    return this.http.put(
      `${environment.apiBaseUrl}/address-maps/${profileId}`,
      mappings
    );
  }

  getAddressMappings(Id: number) {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/address-maps/${Id}`);
  }

  deleteAddressMapping(Id: number | undefined) {
    return this.http.delete(`${environment.apiBaseUrl}/address-maps/${Id}`);
  }
}
