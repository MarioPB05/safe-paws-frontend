import {Component, OnInit} from '@angular/core';
import {AdoptionCardComponent} from '@dashboard/components/adoption-card/adoption-card.component';
import {AdoptionService} from '@dashboard/services/adoption.service';
import {AdoptionAvailable} from '@core/models/adoption.model';
import {NgForOf, NgIf} from '@angular/common';
import {toast} from 'ngx-sonner';
import {HlmIconComponent} from '@spartan-ng/ui-icon-helm';
import {provideIcons} from '@ng-icons/core';
import {lucideAlertTriangle} from '@ng-icons/lucide';
import {
  HlmAlertDescriptionDirective, HlmAlertDirective,
  HlmAlertIconDirective,
  HlmAlertTitleDirective
} from '@spartan-ng/ui-alert-helm';


@Component({
  selector: 'app-adoptions-page',
  standalone: true,
  imports: [
    AdoptionCardComponent,
    NgForOf,
    NgIf,
    HlmIconComponent,
    HlmAlertDescriptionDirective,
    HlmAlertTitleDirective,
    HlmAlertIconDirective,
    HlmAlertDirective
  ],
  templateUrl: './adoptions-page.component.html',
  providers: [provideIcons({ lucideAlertTriangle })]
})
export class AdoptionsPageComponent implements OnInit {
  adoptions: AdoptionAvailable[] = [];
  error: boolean = false;

  constructor(private adoptionService: AdoptionService) { }

  ngOnInit() {
    this.getAdoptions();
  }

  getAdoptions() {
    this.adoptionService.getAdoptions().subscribe({
      next: (adoptions) => {
        this.adoptions = adoptions;
        if(this.adoptions.length === 0) {
          this.error = true;
          toast.error('No hay adopciones disponibles')
        }
      },
      error: (err) => {
        this.error = true;
        toast.error('Hubo un error al cargar las adopciones');
      }
    });
  }

}
