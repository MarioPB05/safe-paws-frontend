import { Injectable } from '@angular/core';
import {HttpClient, HttpContext} from '@angular/common/http';
import {Location, LocationError} from '@core/models/map.model';
import {Observable} from 'rxjs';
import {SkipLoading} from '@core/interceptors/loading.interceptor';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private http: HttpClient) {}

  getLocation(latitude: number, longitude: number): Observable<Location | LocationError> {
    return this.http.get<Location | LocationError>(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`, {
      context: new HttpContext().set(SkipLoading, true)
    });
  }

}
