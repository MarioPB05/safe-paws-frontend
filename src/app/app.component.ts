import {Component, Input, OnInit} from '@angular/core';
import {RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterOutlet} from '@angular/router';
import {LoadingComponent} from '@shared/components/loading/loading.component';
import {Observable, tap} from 'rxjs';
import {AsyncPipe, NgIf} from '@angular/common';
import {LoadingService} from '@core/services/loading.service';
import {HlmToasterComponent} from '@spartan-ng/ui-sonner-helm';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingComponent, NgIf, AsyncPipe, HlmToasterComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {

}
