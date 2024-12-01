import { Injectable } from '@angular/core';
import {HttpClient, HttpContext} from '@angular/common/http';
import {MapPostRequest, MapPostResponse} from '@core/models/post.model';
import {Observable} from 'rxjs';
import {SkipLoading} from '@core/interceptors/loading.interceptor';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private http: HttpClient) {}

  getMapPosts(payload: MapPostRequest): Observable<MapPostResponse[]> {
    return this.http.post<MapPostResponse[]>('/api/adoptions/map', payload, {
      context: new HttpContext().set(SkipLoading, true)
    });
  }

}
