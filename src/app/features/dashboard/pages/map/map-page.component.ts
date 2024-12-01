import {Component, HostBinding, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MapComponent} from '@shared/components/map/map.component';
import {DashboardService} from '@dashboard/services/dashboard.service';
import {HlmH2Directive} from '@spartan-ng/ui-typography-helm';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import * as L from 'leaflet';
import {MapPostRequest} from '@core/models/post.model';
import {MapService} from '@dashboard/services/map.service';
import {debounceTime, Subject, switchMap} from 'rxjs';
import {NgIf} from '@angular/common';
import {HlmBadgeDirective} from '../../../../../libs/ui/ui-badge-helm/src';
import {DetailsCardComponent} from '@dashboard/components/details-card/details-card.component';
import {toast} from 'ngx-sonner';

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [
    MapComponent,
    HlmH2Directive,
    HlmButtonDirective,
    NgIf,
    HlmBadgeDirective,
    DetailsCardComponent,
  ],
  templateUrl: './map-page.component.html'
})
export class MapPageComponent implements OnInit, OnDestroy {
  @HostBinding('class') hostClass = 'flex-1 flex flex-col h-full w-full';
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  @ViewChild(DetailsCardComponent) detailsCardComponent!: DetailsCardComponent;

  private reloadMapSubject = new Subject<L.LatLngBounds>();
  private readonly debounceTimeInMs = 500;
  isLoading = false;

  constructor(
    private dashboardService: DashboardService,
    private mapService: MapService
  ) {
    this.reloadMapSubject.pipe(
      debounceTime(this.debounceTimeInMs),  // Establece el tiempo de espera para el debounce
      switchMap((bounds: L.LatLngBounds) => {
        this.isLoading = true;

        const payload: MapPostRequest = {
          southWest: {
            latitude: bounds.getSouthWest().lat,
            longitude: bounds.getSouthWest().lng
          },
          northEast: {
            latitude: bounds.getNorthEast().lat,
            longitude: bounds.getNorthEast().lng
          }
        };

        return this.mapService.getMapPosts(payload);  // Llamada al servicio con el payload
      })
    ).subscribe(response => {
      this.mapComponent.clearMarkers();

      response.forEach(post => {
        this.mapComponent.addMarker(post.latitude, post.longitude, post.postId, this.detailsCardComponent.showPostDetails.bind(this.detailsCardComponent));
      });

      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    setTimeout(() => this.dashboardService.addCustomClass('h-screen'));
  }

  ngOnDestroy(): void {
    this.dashboardService.addCustomClass('min-h-screen');
  }

  reloadMap(bounds: L.LatLngBounds): void {
    this.reloadMapSubject.next(bounds);
  }

  refreshMap() {
    toast.info('Se ha recargado el mapa');
    this.reloadMapSubject.next(this.mapComponent.getCurrentBounds());
  }
}
