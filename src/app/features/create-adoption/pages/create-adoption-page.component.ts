import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {MapComponent} from '@shared/components/map/map.component';
import {AddressRequest, Location} from '@core/models/map.model';
import {NgForOf} from '@angular/common';
import {HlmLabelDirective} from '@spartan-ng/ui-label-helm';
import {HlmH1Directive, HlmH2Directive, HlmPDirective, HlmUlDirective} from '@spartan-ng/ui-typography-helm';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {provideIcons} from '@ng-icons/core';
import {BrnSelectImports} from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import {lucideChevronDown, lucideChevronUp} from '@ng-icons/lucide';
import {
  HlmSheetComponent,
  HlmSheetContentComponent,
  HlmSheetDescriptionDirective,
  HlmSheetFooterComponent,
  HlmSheetHeaderComponent,
  HlmSheetTitleDirective
} from '@spartan-ng/ui-sheet-helm';
import {toast} from 'ngx-sonner';
import { EnumService } from '@core/services/enum.service';
import {AnimalType} from '@core/models/enums';
import {ImageUploaderComponent} from '@shared/components/image-uploader/image-uploader.component';
import {CreatePostRequest} from '@core/models/post.model';
import {BrnSheetContentDirective, BrnSheetTriggerDirective} from '@spartan-ng/ui-sheet-brain';
import { AdoptionService } from '../services/adoption.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-adoption.page',
  standalone: true,
  imports: [
    MapComponent,
    HlmLabelDirective,
    HlmH1Directive,
    HlmH2Directive,
    HlmButtonDirective,
    HlmInputDirective,
    FormsModule,
    ReactiveFormsModule,
    BrnSelectImports,
    HlmSelectImports,
    BrnSheetTriggerDirective, // El IDE dice que no se usa, pero se usa en la plantilla
    BrnSheetContentDirective, // El IDE dice que no se usa, pero se usa en la plantilla
    HlmSheetComponent,
    HlmSheetContentComponent,
    HlmSheetHeaderComponent,
    HlmSheetFooterComponent,
    HlmSheetTitleDirective,
    HlmSheetDescriptionDirective,
    HlmPDirective,
    HlmUlDirective,
    NgForOf,
    ImageUploaderComponent
  ],
  providers: [provideIcons({ lucideChevronUp, lucideChevronDown })],
  templateUrl: './create-adoption-page.component.html'
})
export class CreateAdoptionPageComponent implements OnInit {
  @ViewChild('sheet') sheet!: HlmSheetComponent;

  private _formBuilder = inject(FormBuilder);
  private enumService = inject(EnumService);
  private router = inject(Router);
  private adoptionService = inject(AdoptionService);

  shouldResetMap = false;

  form = this._formBuilder.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    description: ['', Validators.required],
    address: [{ value: '', disabled: true }, Validators.required]
  });
  image: File | null = null;
  address: AddressRequest | null = null;
  isSubmitting = false;

  animalTypes: AnimalType[] = [];

  ngOnInit() {
    this.enumService.getAnimalTypes().subscribe({
      next: (animalTypes) => {
        this.animalTypes = animalTypes.reverse();
      }
    });
  }

  locationUpdated(location: Location) {
    let addressInput = '';

    const address = location.address;

    this.address = {
      coordinateX: Number(location.lat),
      coordinateY: Number(location.lon),
      road: address.road,
      neighborhood: address.neighbourhood ?? null,
      village: address.village ?? null,
      province: address.province,
      state: address.state,
      postcode: address.postcode ?? null,
      country: address.country,
      countryCode: address.country_code
    }

    if (address.road != undefined) addressInput += `${address.road}, `;
    if (address.postcode != undefined) addressInput += `${address.postcode}, `;
    if (address.village != undefined) addressInput += `${address.village}, `;
    if (address.province != undefined) addressInput += `${address.province}, `;
    if (address.state != undefined) addressInput += `${address.state}`;

    this.form.get('address')?.setValue(addressInput);
  }

  resetLocation() {
    this.shouldResetMap = true;
    setTimeout(() => this.shouldResetMap = false, 0);
  }

  getFormValues() {
    const name = this.form.get('name')?.value;
    const type = this.form.get('type')?.value;
    const description = this.form.get('description')?.value;
    const address = this.form.get('address')?.value;

    return { name, type, description, address };
  }

  imageSelected(file: File) {
    this.image = file;
  }

  verifyForm() {
    const {
      name: nameValue,
      type: typeValue,
      description: descriptionValue,
      address: addressValue
    } = this.getFormValues();

    if (!nameValue && !typeValue && !descriptionValue && !addressValue) {
      toast.error('Por favor, rellena todos los campos');
      return;
    }

    if (!nameValue) {
      toast.error('Por favor, introduce un nombre');
      return;
    }

    if (typeValue === '' || typeValue === null || typeValue === undefined) {
      toast.error('Por favor, selecciona un tipo');
      return;
    }

    if (!descriptionValue) {
      toast.error('Por favor, introduce una descripción');
      return;
    }

    if (!addressValue) {
      toast.error('Por favor, selecciona una dirección');
      return;
    }

    if (this.image === null) {
      toast.error('Por favor, selecciona una imagen');
      return;
    }

    if (this.form.valid && addressValue !== '') {
      this.sheet.setSide = 'bottom';
      this.sheet.open();
      return;
    }
  }

  onSubmit() {
    this.isSubmitting = true;

    console.log(this.address);

    if (this.address === null) {
      toast.error('Por favor, selecciona una dirección');
      this.isSubmitting = false;
      return;
    }

    if (this.form.valid) {
      const {
        name: nameValue,
        type: typeValue,
        description: descriptionValue
      } = this.getFormValues() as { name: string; type: string; description: string; };

      const adoptionRequest: CreatePostRequest = {
        name: nameValue,
        description: descriptionValue,
        typeId: Number(typeValue),
        address: this.address
      }

      const formData = new FormData();

      formData.append('dto', new Blob([JSON.stringify(adoptionRequest)], { type: 'application/json' }));
      formData.append('file', this.image as Blob);

      this.sheet.close(null);

      this.adoptionService.createAdoption(formData).subscribe({
        next: (adoptionId) => {
          if (adoptionId === 0) {
            toast.error('Error al crear la adopción, por favor, inténtalo de nuevo');
            return;
          }

          this.router.navigate(['/dashboard']).then(r => toast.success('Adopción creada correctamente'));
        },
        error: () => {
          toast.error('Error al crear la adopción, por favor, inténtalo de nuevo');
        }
      });
    }

    this.isSubmitting = false;
  }

}
