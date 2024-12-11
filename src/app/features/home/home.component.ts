import {Component, inject} from '@angular/core';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {HlmH2Directive} from '@spartan-ng/ui-typography-helm';
import {toast} from 'ngx-sonner';
import {Router} from '@angular/router';
import {AuthService} from '@core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HlmButtonDirective,
    HlmH2Directive
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  private router: Router = inject(Router);
  private globalAuthService: AuthService = inject(AuthService);

  suscribeNewsLetter() {
    toast.success('Te has suscrito correctamente');
  }

  redirect() {
    this.globalAuthService.isAuthenticated().subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['/dashboard']).then(r => toast.info('Bienvenido de nuevo'));
      } else {
        this.router.navigate(['/login']).then(r => toast.info('Introduce tus datos y disfruta de la experiencia'));
      }
    });
  }
}
