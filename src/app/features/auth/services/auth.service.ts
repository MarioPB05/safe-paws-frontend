import { Injectable } from '@angular/core';
import {HttpClient, HttpContext} from '@angular/common/http';
import {AuthResponse} from '@core/models/auth.model';
import {Observable} from 'rxjs';
import {SkipAuth} from '@core/interceptors/auth.interceptor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/authenticate', {username, password}, {
      context: new HttpContext().set(SkipAuth, true)
    });
  }

  register(registerRequest: FormData): Observable<string> {
    return this.http.post<string>(`/api/auth/register`, registerRequest, {
      context: new HttpContext().set(SkipAuth, true)
    });
  }

}

