import { Component } from '@angular/core';
import {LoadingService} from '@core/services/loading.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  constructor(private loadingService: LoadingService) {
    this.loadingService.loadingOn();

    setTimeout(() => {
      this.loadingService.loadingOff();
    }, 5000);
  }
}
