import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {CreateRequest, Request} from '@core/models/request.model';

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

  createRequest(dto: CreateRequest): Observable<string> {
    return this.http.post(`${this.baseUrl}/add`, dto, { responseType: 'text' });
  }

  getRequestPdf(requestCode: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${requestCode}/pdf`, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/pdf'
      })
    });
  }

}
