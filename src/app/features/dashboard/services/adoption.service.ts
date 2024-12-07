import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AdoptionAvailable} from '@core/models/adoption.model';
import {CheckPostResponse} from '@core/models/post.model';

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

  checkRequest(postId: number): Observable<CheckPostResponse> {
    return this.http.get<CheckPostResponse>(`/api/adoptions/${postId}/check-request`);
  }
}
