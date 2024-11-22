import { Injectable } from '@angular/core';
import {HttpClient, HttpContext} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Request} from '@core/models/request.model';
import {SkipLoading} from '@core/interceptors/loading.interceptor';

@Injectable({
  providedIn: 'root',
})
export class RequestService {

  private readonly baseUrl = '/api/requests'; // El proxy redirige a http://localhost:8080

  constructor(private http: HttpClient) {}

  // Obtener las respuestas de adopciones recibidas
  getReceivedAdoptions(): Observable<Request[]> {
    return this.http.get<Request[]>(`${this.baseUrl}/received`);
  }

  // Obtener las respuestas de adopciones enviadas
  getSentAdoptions(): Observable<Request[]> {
    return this.http.get<Request[]>(`${this.baseUrl}/sent`);
  }


}
