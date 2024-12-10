import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {CreateRequest, Request, RequestStatusResponse} from '@core/models/request.model';
import {toast} from 'ngx-sonner';
import {SignContractRequest} from '@core/models/post.model';

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

  simulateDownloadPdf(pdf: Blob, pdfTitle: string): void {
    const file = new Blob([pdf], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);

    const a = document.createElement('a');
    a.href = fileURL;
    a.download = pdfTitle + '.pdf';
    a.click();
  }

  downloadRequestPdf(requestCode: string): void {
    this.getRequestPdf(requestCode).subscribe({
      next: (pdfBlob) => {
        this.simulateDownloadPdf(pdfBlob, 'adoption_request_' + requestCode);
      },
      error: () => {
        toast.error('No se pudo descargar el archivo PDF');
      }
    })
  }

  downloadAdoptionContract(requestCode: string): void {
    this.http.get(`${this.baseUrl}/${requestCode}/contract`, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/pdf'
      })
    }).subscribe({
      next: (pdfBlob) => {
        this.simulateDownloadPdf(pdfBlob, 'adoption_contract_' + requestCode);
      },
      error: () => {
        toast.error('No se pudo descargar el contrato de adopción');
      }
    });
  }

  getRequestStatus(requestCode: string): Observable<RequestStatusResponse> {
    return this.http.get<RequestStatusResponse>(`${this.baseUrl}/${requestCode}/status`);
  }

  acceptRequest(requestCode: string): Observable<string> {
    return this.http.get(`${this.baseUrl}/${requestCode}/accept`, { responseType: 'text' });
  }

  rejectRequest(requestCode: string): Observable<string> {
    return this.http.get(`${this.baseUrl}/${requestCode}/reject`, { responseType: 'text' });
  }

  signContract(requestCode: string, dto: SignContractRequest): Observable<string> {
    return this.http.post(`${this.baseUrl}/${requestCode}/sign-contract`, dto, { responseType: 'text' });
  }

}
