import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly customClass$ = new BehaviorSubject<string>('min-h-screen');

  addCustomClass(customClass: string): void {
    this.customClass$.next(customClass);
  }

  getCurrentCustomClass(): Observable<string> {
    return this.customClass$.asObservable();
  }

}
