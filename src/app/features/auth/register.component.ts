import {Component, inject} from '@angular/core';
import {HlmIconComponent} from '@spartan-ng/ui-icon-helm';
import {
  HlmTabsComponent,
  HlmTabsContentDirective,
  HlmTabsListComponent,
  HlmTabsTriggerDirective
} from '@spartan-ng/ui-tabs-helm';
import {HlmH2Directive} from '@spartan-ng/ui-typography-helm';
import {AuthService} from '@features/auth/services/auth.service';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {HlmFormFieldComponent, HlmHintDirective} from '@spartan-ng/ui-formfield-helm';
import {HlmInputDirective,} from '@spartan-ng/ui-input-helm';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {ImageUploaderComponent} from '@shared/components/image-uploader/image-uploader.component';
import {provideIcons} from '@ng-icons/core';
import {lucideEye, lucideEyeOff,lucideBadgeInfo} from '@ng-icons/lucide';
import {NgIf} from '@angular/common';
import {MapComponent} from '@shared/components/map/map.component';
import {AddressRequest, Location} from '@core/models/map.model';
import {toast} from 'ngx-sonner';
import {RegisterRequest} from '@core/models/register.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    HlmIconComponent,
    HlmTabsComponent,
    HlmTabsContentDirective,
    HlmTabsListComponent,
    HlmTabsTriggerDirective,
    ReactiveFormsModule,
    HlmFormFieldComponent,
    HlmInputDirective,
    HlmButtonDirective,
    HlmH2Directive,
    ImageUploaderComponent,
    NgIf,
    MapComponent,
    HlmHintDirective
  ],
  templateUrl: './register.component.html',
  providers: [provideIcons({lucideEye, lucideEyeOff,lucideBadgeInfo})]


})
export class RegisterComponent {

  private _formBuilder = inject(FormBuilder);
  private registerService = inject(AuthService);
  private router = inject(Router);



  form = this._formBuilder.group({
    username: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
    password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    email: ['', Validators.compose([Validators.required, Validators.email])],
    name: ['', Validators.required],
    surname: ['', Validators.required],
    dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}[A-Za-z]$/)]],
    birthdate: ['', [Validators.required, this.minimumAgeValidator(18)]],
    address: [{ value: '', disabled: true }, Validators.required]
  });
  photo: File | null = null;
  address: AddressRequest | null = null;
  isSubmitting = false;

  minimumAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const birthdate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthdate.getFullYear();
      const monthDifference = today.getMonth() - birthdate.getMonth();
      const dayDifference = today.getDate() - birthdate.getDate();

      if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--;
      }

      return age >= minAge ? null : { minimumAge: { requiredAge: minAge, actualAge: age } };
    };
  }
  getFormValues() {
    const username = this.form.get('username')?.value!;
    const password = this.form.get('password')?.value!;
    const email = this.form.get('email')?.value!;
    const name = this.form.get('name')?.value!;
    const dni = this.form.get('dni')?.value!;
    const surname = this.form.get('surname')?.value!;
    const address = this.form.get('address')?.value!;
    const birthdate = this.form.get('birthdate')?.value!;


    return { username, password, email, name, dni, surname, address, birthdate };
  }

  imageSelected(file: File) {
    this.photo  = file;
  }



  onRegister() {
    this.isSubmitting = true;

    if (this.address === null) {
      toast.error('Por favor, selecciona una dirección');
      this.isSubmitting = false;
      return;
    }

    if (this.form.valid) {
      const formValues = this.getFormValues();
      console.log('Form Values:', formValues);

      const registerRequest: RegisterRequest = {
        username: formValues.username,
        password: formValues.password,
        email: formValues.email,
        name: formValues.name,
        surname: formValues.surname,
        dni: formValues.dni,
        birthdate: formValues.birthdate,
        coordinateX: this.address.coordinateX,
        coordinateY: this.address.coordinateY,
        road: this.address.road,
        neighborhood: this.address.neighborhood,
        village: this.address.village,
        province: this.address.province,
        state: this.address.state,
        postcode: this.address.postcode,
        country: this.address.country,
        countryCode: this.address.countryCode
      };

      const formData = new FormData();
      const dtoBlob = new Blob([JSON.stringify(registerRequest)], { type: 'application/json' });
      formData.append('dto', dtoBlob);
      if (this.photo) {
        formData.append('file', this.photo);
      }

      // Log the FormData contents
      formData.forEach((value, key) => {
        if (key === 'dto') {
          const reader = new FileReader();
          reader.onload = () => {
            console.log(`${key}:`, reader.result);
          };
          reader.readAsText(value as Blob);
        } else {
          console.log(`${key}:`, value);
        }
      });

      this.registerService.register(formData).subscribe({
        next: () => {
          this.router.navigate(['/login']).then(() => toast.success('Registro exitoso, por favor, inicia sesión'));

        }
      });

      toast('Registrando usuario...');
    } else {
      toast.error('Por favor, rellena todos los campos');
    }
    this.isSubmitting = false;
  }

  locationUpdated(location: Location) {
    let addressInput = '';

    const address = location.address;

    this.address = {
      coordinateX: Number(location.lon),
      coordinateY: Number(location.lat),
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


  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  goToTab1($event: Event) {
    $event.preventDefault();
    const tabTrigger = document.querySelector('[hlmTabsTrigger="step-1"]') as HTMLElement;
    if (tabTrigger) {
      tabTrigger.click();

    }
  }
  goToTab2(event: Event): void {
    event.preventDefault();
    const tabTrigger = document.querySelector('[hlmTabsTrigger="step-2"]') as HTMLElement;
    if (tabTrigger) {
      tabTrigger.click();
    }
  }
  displayToast(event: Event): void {
    toast.info('La edad mínima es de 18 años');
  }

}
