import {Component, inject} from '@angular/core';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {NgClass} from '@angular/common';
import {HlmIconComponent} from '@spartan-ng/ui-icon-helm';
import {HlmH1Directive, HlmH2Directive, HlmH3Directive, HlmPDirective} from '@spartan-ng/ui-typography-helm';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {HlmErrorDirective, HlmFormFieldComponent} from '@spartan-ng/ui-formfield-helm';
import { AuthService } from './services/auth.service';
import { AuthService as GlobalAuthService } from '@core/services/auth.service';
import {toast} from 'ngx-sonner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HlmInputDirective, NgClass, HlmIconComponent, HlmH3Directive, HlmButtonDirective, HlmPDirective, HlmH2Directive, HlmH1Directive, ReactiveFormsModule, HlmFormFieldComponent, HlmErrorDirective],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _globalAuthService = inject(GlobalAuthService);
  private router = inject(Router);

  form = this._formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  isSubmitting = false;

  onSubmit() {
    this.isSubmitting = true;

    if (this.form.valid) {
      const username = this.form.get('username')?.value;
      const password = this.form.get('password')?.value;

      if (!username || !password) {
        toast.error('Por favor, introduce un usuario y contraseña');
        return;
      }

      toast('Iniciando sesión...');

      this._authService.login(username, password).subscribe({
        next: (authResponse) => {
          this._globalAuthService.setToken(authResponse.token);

          this.router.navigate(['/dashboard']).then(() => {
            toast.success('Sesión iniciada correctamente');
          });
        },
        error: () => {
          toast.error('Error al iniciar sesión', {
            description: 'El usuario o la contraseña son incorrectos'
          });
          this.isSubmitting = false;
        },
        complete: () => {
          console.log('asd')
        }
      });

      return;
    }

    this.isSubmitting = false;
  }
}
