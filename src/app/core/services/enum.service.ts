import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {AnimalType} from '@core/models/enums';

@Injectable({
  providedIn: 'root'
})
export class EnumService {

  constructor(private http: HttpClient) { }

  getAnimalTypes(): Observable<AnimalType[]> {
    return this.http.get<{ [key: string]: number }>('/api/adoptions/animalTypes').pipe(
      map((response) =>
        Object
          .entries(response)
          .map(([name, id]) => ({ id, name }))
      )
    );
  }

}
