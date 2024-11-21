import { Injectable } from '@angular/core';
import {HttpClient, HttpContext} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AdoptionAvailable} from '@core/models/adoption.model';
import {SkipLoading} from '@core/interceptors/loading.interceptor';

@Injectable({
  providedIn: 'root'
})
export class AdoptionService {

  constructor(private http: HttpClient) { }

  getAdoptions(): Observable<AdoptionAvailable[]> {
    return this.http.get<AdoptionAvailable[]>('/api/adoptions/',  {
      context: new HttpContext().set(SkipLoading, true) // TODO Si se pone el loading da error
    });
  }
}
