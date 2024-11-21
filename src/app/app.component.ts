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
export class AppComponent implements OnInit {
  loading$: Observable<boolean>;

  @Input()
  detectRouteTransitions = false;

  constructor(
    private loadingService: LoadingService,
    private router: Router
  ) {
    this.loading$ = this.loadingService.loading$;
  }

  ngOnInit() {
    if (this.detectRouteTransitions) {
      this.router.events
        .pipe(
          tap((event) => {
            if (event instanceof RouteConfigLoadStart) {
              this.loadingService.loadingOn();
            } else if (event instanceof RouteConfigLoadEnd) {
              this.loadingService.loadingOff();
            }
          })
        )
        .subscribe();
    }
  }
}
