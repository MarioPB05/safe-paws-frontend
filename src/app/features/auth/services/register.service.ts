import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Cambiamos la URL base para que use el path relativo gestionado por el proxy
  private baseUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  register(registerRequest: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, registerRequest);
  }
}
