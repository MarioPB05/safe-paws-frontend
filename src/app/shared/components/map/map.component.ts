import {AfterViewInit, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {toast} from 'ngx-sonner';
import {MapService} from '@shared/services/map.service';
import {Location, LocationError} from '@core/models/map.model';

type Callback = (post: number) => void;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html'
})
export class MapComponent implements AfterViewInit {
  @Input() interactive = true;
  @Input() set resetMap(reset: boolean) {
    if (reset && this.map) {
      this.resetMapView();
    }
  }
  @Input() maxMarkers = 1; // 0 for unlimited markers

  @Output() locationUpdated = new EventEmitter<Location>();
  @Output() boundsUpdated = new EventEmitter<L.LatLngBounds>();

  private map: L.Map | undefined;
  private currentMarkers: L.Marker[] = [];
  private mapService = inject(MapService);
  private defaultLatitude = 37.3862458;
  private defaultLongitude = -5.9849204;
  private customIcon = L.icon({
    iconUrl: '/marker.png',
    iconSize: [32, 32]
  });
  private loadingMarker = false;

  private getUserLocation(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          toast.success('Ubicación obtenida correctamente.');

          this.initMap(latitude, longitude);
        },
        () => {
          toast.error('Error al obtener ubicación.');
          this.initMap(this.defaultLatitude, this.defaultLongitude);
        }
      );
    } else {
      toast.error('Geolocalización no está soportada por el navegador.');
      this.initMap(this.defaultLatitude, this.defaultLongitude);
    }
  }

  private initMap(latitude: number, longitude: number): void {
    this.map = L.map('map', {
      center: [latitude, longitude],
      zoom: 13
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map).on('load', () => this.emitBounds());

    if (this.interactive) {
      this.map.on('click', this.onMapClick.bind(this));
    }

    this.map.on('moveend', () => this.emitBounds());
  }

  private emitBounds(): void {
    const bounds = this.map?.getBounds().pad(0.2);

    if (bounds != undefined) this.boundsUpdated.emit(bounds);
  }

  private onMapClick(event: L.LeafletMouseEvent): void {
    const { lat, lng } = event.latlng;

    this.addMarker(lat, lng);
  }

  public addMarker(latitude: number, longitude: number, id: number|null = null, callback: Callback|null = null): void {
    if (this.loadingMarker && this.interactive) {
      return;
    }

    this.loadingMarker = true;

    if (this.maxMarkers > 0 && this.currentMarkers.length > this.maxMarkers) {
      this.currentMarkers.forEach(marker => this.map?.removeLayer(marker));
    }

    if (this.interactive) {
      this.mapService.getLocation(latitude, longitude).subscribe({
        next: (location) => {
          if ((location as LocationError).error) {
            toast.error('Error al obtener la ubicación.');
            return;
          }

          location = location as Location;

          if (location.address.country !== 'España') {
            toast.error('Solo se permiten ubicaciones en España.');
            return;
          }

          this.locationUpdated.emit(location);

          this.currentMarkers.push(
            L.marker([latitude, longitude], {icon: this.customIcon}).addTo(this.map!)
          );
        },
        error: () => {
          toast.error('Error al obtener la ubicación.');
        },
        complete: () => {
          this.loadingMarker = false;
        }
      });
    }else {
      this.currentMarkers.push(L.marker([latitude, longitude], {icon: this.customIcon}).addTo(this.map!));
    }

    if (callback && id) {
      const lastMarker = this.currentMarkers[this.currentMarkers.length - 1];

      lastMarker.on('click', callback.bind(null, id));

      lastMarker.bindTooltip('Ver detalles', {
        permanent: false,
        direction: 'bottom'
      });
    }
  }

  public clearMarkers(): void {
    this.currentMarkers.forEach(marker => this.map?.removeLayer(marker));
    this.currentMarkers = [];
  }

  public getCurrentBounds(): L.LatLngBounds {
    if (!this.map) {
      return L.latLngBounds([0, 0], [0, 0]);
    }

    return this.map.getBounds();
  }

  private resetMapView(): void {
    if (this.map) {
      this.map.remove();
      this.map = undefined;

      this.getUserLocation();
    }
  }

  public reinitializeMap(): void {
    this.resetMapView();
  }

  ngAfterViewInit() {
    this.getUserLocation();
  }

}
