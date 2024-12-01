import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AdoptionAvailable} from '@core/models/adoption.model';

@Injectable({
  providedIn: 'root'
})
export class AdoptionService {
  constructor(private http: HttpClient) { }

  getAdoptions(): Observable<AdoptionAvailable[]> {
    return this.http.get<AdoptionAvailable[]>('/api/adoptions/');
  }

  getAdoptionDetail(id: number): Observable<AdoptionAvailable> {
    return this.http.get<AdoptionAvailable>(`/api/adoptions/${id}`);
  }
}
