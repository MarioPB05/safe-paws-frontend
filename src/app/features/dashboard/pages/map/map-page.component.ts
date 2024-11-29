import {Component, HostBinding, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MapComponent} from '@shared/components/map/map.component';
import {DashboardService} from '@dashboard/services/dashboard.service';
import {HlmH1Directive, HlmH2Directive, HlmH3Directive} from '@spartan-ng/ui-typography-helm';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import * as L from 'leaflet';
import {MapPostRequest} from '@core/models/post.model';
import {MapService} from '@dashboard/services/map.service';
import {debounceTime, Subject, switchMap} from 'rxjs';
import {NgIf} from '@angular/common';
import {HlmBadgeDirective} from '../../../../../libs/ui/ui-badge-helm/src';
import {BrnSheetContentDirective, BrnSheetTriggerDirective} from '@spartan-ng/ui-sheet-brain';
import {
  HlmSheetComponent,
  HlmSheetContentComponent, HlmSheetDescriptionDirective,
  HlmSheetFooterComponent,
  HlmSheetHeaderComponent, HlmSheetTitleDirective
} from '@spartan-ng/ui-sheet-helm';

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [
    MapComponent,
    HlmH1Directive,
    HlmH2Directive,
    HlmButtonDirective,
    HlmH3Directive,
    NgIf,
    HlmBadgeDirective,
    BrnSheetTriggerDirective, // El IDE dice que no se usa, pero se usa en la plantilla
    BrnSheetContentDirective, // El IDE dice que no se usa, pero se usa en la plantilla
    HlmSheetComponent,
    HlmSheetContentComponent,
    HlmSheetHeaderComponent,
    HlmSheetFooterComponent,
    HlmSheetTitleDirective,
    HlmSheetDescriptionDirective,
  ],
  templateUrl: './map-page.component.html'
})
export class MapPageComponent implements OnInit, OnDestroy {
  @HostBinding('class') hostClass = 'flex-1 flex flex-col h-full w-full';
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  @ViewChild('sheetComponent') sheet!: HlmSheetComponent;

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
        this.mapComponent.addMarker(post.latitude, post.longitude, () => this.openSheet());
      });

      this.isLoading = false;
    });
  }

  openSheet(): void {
    this.sheet.setSide = 'bottom';
    this.sheet.open();
  }

  ngOnInit(): void {
    setTimeout(() => this.dashboardService.addCustomClass('h-screen'));
  }

  ngOnDestroy(): void {
    this.dashboardService.addCustomClass('min-h-screen');
  }

  // Método que se llama cuando el mapa se mueve o cambia
  reloadMap(bounds: L.LatLngBounds): void {
    this.reloadMapSubject.next(bounds);
  }
}
