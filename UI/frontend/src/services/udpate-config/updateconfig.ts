import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../env/environment';
import { Observable, catchError, of, timeout } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Updateconfig {
  private http = inject(HttpClient);

  constructor() {}

  // Method for hot-reload (default behavior)
  updateConfig(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post(`${environment.restartOpenmuc}`, {}, { headers })
      .pipe(
        timeout(10000), // 10 second timeout
        catchError((error) => {
          console.error('Config update failed:', error);
          return of({ 
            error: 'Configuration update failed',
            details: error.message || 'Unknown error'
          });
        })
      );
  }

  // Method for full restart
  restartApplication(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post(`${environment.restartOpenmuc}?action=restart`, {}, { headers })
      .pipe(
        timeout(15000), // 15 second timeout for restart
        catchError((error) => {
          console.error('Application restart failed:', error);
          return of({ 
            error: 'Application restart failed',
            details: error.message || 'Unknown error'
          });
        })
      );
  }

  updateConfigViaGet(): Observable<any> {
    return this.http
      .get(`${environment.restartOpenmuc}`)
      .pipe(
        timeout(10000),
        catchError((error) => {
          console.error('Config update via GET failed:', error);
          return of({ 
            error: 'Configuration update via GET failed',
            details: error.message || 'Unknown error'
          });
        })
      );
  }

  // Method for restart via GET
  restartApplicationViaGet(): Observable<any> {
    return this.http
      .get(`${environment.restartOpenmuc}?action=restart`)
      .pipe(
        timeout(15000),
        catchError((error) => {
          console.error('Application restart via GET failed:', error);
          return of({ 
            error: 'Application restart via GET failed',
            details: error.message || 'Unknown error'
          });
        })
      );
  }
}