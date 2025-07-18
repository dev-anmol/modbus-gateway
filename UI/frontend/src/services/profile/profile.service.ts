import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../env/environment';
import { ProfileModel } from '../../models/profile.type';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);
  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor() {}

  createDeviceProfile(profile: ProfileModel) {
    return this.http.post(`${environment.apiBaseUrl}/device-profile`, profile, {
      headers: this.httpHeaders,
    });
  }

  getAllDeviceProfiles() {
    return this.http.get<ProfileModel[]>(`${environment.apiBaseUrl}/device-profile`);
  }

  getDeviceProfileById(Id : number) {
    return this.http.get<ProfileModel>(`${environment.apiBaseUrl}/device-profile/${Id}`);
  }

  updateDeviceProfile(Id: number, profile: ProfileModel) {
    return this.http.put(`${environment.apiBaseUrl}/device-profile/${Id}`, profile, {
      headers : this.httpHeaders,
    });
  }
}
