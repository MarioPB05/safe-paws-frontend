import {Component, ViewChild} from '@angular/core';
import {BrnSheetContentDirective} from '@spartan-ng/ui-sheet-brain';
import {
  HlmSheetComponent,
  HlmSheetContentComponent,
  HlmSheetHeaderComponent,
} from '@spartan-ng/ui-sheet-helm';
import {AdoptionService} from '@dashboard/services/adoption.service';
import {EnumService} from '@core/services/enum.service';
import {forkJoin} from 'rxjs';
import {AdoptionAvailable} from '@core/models/adoption.model';
import {HlmH3Directive, HlmPDirective} from '@spartan-ng/ui-typography-helm';
import {HlmBadgeDirective} from '../../../../../libs/ui/ui-badge-helm/src';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {toast} from 'ngx-sonner';
import {NgIf} from '@angular/common';

interface AdoptionDetail extends AdoptionAvailable {
  animalType: string;
}

@Component({
  selector: 'app-details-card',
  standalone: true,
  imports: [
    BrnSheetContentDirective, // El IDE dice que no se usa, pero se usa en la plantilla
    HlmSheetComponent,
    HlmSheetContentComponent,
    HlmSheetHeaderComponent,
    HlmH3Directive,
    HlmBadgeDirective,
    HlmPDirective,
    HlmButtonDirective,
    NgIf,
  ],
  templateUrl: './details-card.component.html'
})
export class DetailsCardComponent {
  @ViewChild('sheetComponent') sheet!: HlmSheetComponent;

  currentAdoption: AdoptionDetail | null = null;
  showBtn = true;

  constructor(
    private adoptionService: AdoptionService,
    private enumService: EnumService
  ) {}

  openSheet(): void {
    this.sheet.setSide = 'bottom';
    this.sheet.open();
  }

  public showPostDetails(post: number, showBtn: boolean = true): void {
    this.showBtn = showBtn;

    forkJoin({
      animalTypes: this.enumService.getAnimalTypes(),
      adoptionDetail: this.adoptionService.getAdoptionDetail(post)
    }).subscribe({
      next: ({animalTypes, adoptionDetail}) => {
        const animalType = animalTypes.find(({id}) => id === adoptionDetail.typeId);

        this.currentAdoption = {
          ...adoptionDetail,
          animalType: animalType?.name || 'Desconocido'
        };

        this.openSheet();
      },
      error: () => {
        toast.error('No se pudo cargar los detalles del animal');
      }
    })
  }

}
