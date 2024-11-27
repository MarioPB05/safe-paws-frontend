import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdoptionService {

  constructor(private http: HttpClient) { }

  createAdoption(adoption: FormData): Observable<number> {
    return this.http.post<number>('/api/adoptions/new', adoption);
  }

}
