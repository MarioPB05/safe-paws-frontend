import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthResponse} from '@core/models/auth.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/authenticate', {username, password});
  }

}
