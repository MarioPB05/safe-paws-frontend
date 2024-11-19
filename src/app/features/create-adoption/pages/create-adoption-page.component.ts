import {Component, inject, ViewChild} from '@angular/core';
import {MapComponent} from '@shared/components/map/map.component';
import {Location} from '@core/models/map.model';
import {NgClass} from '@angular/common';
import {HlmLabelDirective} from '@spartan-ng/ui-label-helm';
import {HlmH1Directive, HlmH2Directive, HlmPDirective, HlmUlDirective} from '@spartan-ng/ui-typography-helm';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {provideIcons} from '@ng-icons/core';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import {lucideChevronDown, lucideChevronUp} from '@ng-icons/lucide';
import {HlmCheckboxComponent} from '@spartan-ng/ui-checkbox-helm';
import {
  HlmSheetComponent,
  HlmSheetContentComponent,
  HlmSheetDescriptionDirective,
  HlmSheetFooterComponent,
  HlmSheetHeaderComponent,
  HlmSheetTitleDirective
} from '@spartan-ng/ui-sheet-helm';
import {BrnSheetContentDirective, BrnSheetTriggerDirective} from '@spartan-ng/ui-sheet-brain';
import {toast} from 'ngx-sonner';

@Component({
  selector: 'app-create-adoption.page',
  standalone: true,
  imports: [
    MapComponent,
    NgClass,
    HlmLabelDirective,
    HlmH1Directive,
    HlmH2Directive,
    HlmButtonDirective,
    HlmInputDirective,
    FormsModule,
    ReactiveFormsModule,
    BrnSelectImports,
    HlmSelectImports,
    HlmCheckboxComponent,
    BrnSheetTriggerDirective,
    BrnSheetContentDirective,
    HlmSheetComponent,
    HlmSheetContentComponent,
    HlmSheetHeaderComponent,
    HlmSheetFooterComponent,
    HlmSheetTitleDirective,
    HlmSheetDescriptionDirective,
    HlmPDirective,
    HlmUlDirective
  ],
  providers: [provideIcons({ lucideChevronUp, lucideChevronDown })],
  templateUrl: './create-adoption-page.component.html'
})
export class CreateAdoptionPageComponent {
  @ViewChild('sheet') sheet!: HlmSheetComponent;

  private _formBuilder = inject(FormBuilder);

  shouldResetMap = false;
  previewUrl: string | ArrayBuffer | null = '';
  showPreview = false;

  form = this._formBuilder.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    description: ['', Validators.required],
    address: [{ value: '', disabled: true }, Validators.required]
  });
  isSubmitting = false;

  locationUpdated(location: Location) {
    let addressInput = '';

    const address = location.address;

    // this.address = `[${location.lat}, ${location.lon}] `;

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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.previewUrl = reader.result;
        this.showPreview = true;
      };

      reader.readAsDataURL(file);
    }
  }

  getFormValues() {
    const name = this.form.get('name')?.value;
    const type = this.form.get('type')?.value;
    const description = this.form.get('description')?.value;
    const address = this.form.get('address')?.value;

    return { name, type, description, address };
  }

  verifyForm() {
    const {
      name: nameValue,
      type: typeValue,
      description: descriptionValue,
      address: addressValue
    } = this.getFormValues();

    if (this.form.valid && addressValue !== '') {
      this.sheet.setSide = 'bottom';
      this.sheet.open();
      return;
    }

    if (!nameValue && !typeValue && !descriptionValue && !addressValue) {
      toast.error('Por favor, rellena todos los campos');
      return;
    }

    if (!nameValue) {
      toast.error('Por favor, introduce un nombre');
      return;
    }

    if (!typeValue) {
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
  }

  onSubmit() {
    this.isSubmitting = true;

    if (this.form.valid) {
      const {
        name: nameValue,
        type: typeValue,
        description: descriptionValue,
        address: addressValue
      } = this.getFormValues();

      console.log('Enviando datos:', { nameValue, typeValue, descriptionValue, addressValue });
    }

    this.isSubmitting = false;
  }

}
