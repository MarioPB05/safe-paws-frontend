import { Component } from '@angular/core';
import {HlmIconComponent} from '@spartan-ng/ui-icon-helm';
import {
  HlmTabsComponent,
  HlmTabsContentDirective,
  HlmTabsListComponent,
  HlmTabsTriggerDirective
} from '@spartan-ng/ui-tabs-helm';
import {HlmH1Directive, HlmH2Directive, HlmH3Directive, HlmPDirective} from '@spartan-ng/ui-typography-helm';

import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HlmErrorDirective, HlmFormFieldComponent} from '@spartan-ng/ui-formfield-helm';
import {HlmInputDirective, HlmInputErrorDirective} from '@spartan-ng/ui-input-helm';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {ImageUploaderComponent} from '@shared/components/image-uploader/image-uploader.component';
import {provideIcons} from '@ng-icons/core';
import {lucideEye, lucideEyeOff} from '@ng-icons/lucide';
import {NgIf} from '@angular/common';
import {MapComponent} from '@shared/components/map/map.component';
import {AuthService} from '@features/auth/services/register.service';
import {HlmLabelDirective} from '@spartan-ng/ui-label-helm';


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
    HlmLabelDirective,


  ],
  templateUrl: './register.component.html',
  providers: [provideIcons({lucideEye, lucideEyeOff})]


})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      dni: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      birthdate: ['', [Validators.required]],
      photo: [''],
      coordinateX: [null],
      coordinateY: [null],
      road: [''],
      neighborhood: [''],
      village: [''],
      province: [''],
      state: [''],
      postcode: [''],
      country: [''],
      countryCode: [''],
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      const registerData = this.registerForm.value;
      this.authService.register(registerData).subscribe();
    } else {
      console.error('Formulario inválido');
    }
  }

  goToTab2(event: Event): void {
    event.preventDefault(); // Evita el comportamiento predeterminado del botón
    const tabTrigger = document.querySelector('[hlmTabsTrigger="step-2"]') as HTMLElement;
    if (tabTrigger) {
      tabTrigger.click(); // Simula un clic en el botón del tab 2
    }
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
}
