import {Component, inject} from '@angular/core';
import {HlmIconComponent} from "@spartan-ng/ui-icon-helm";
import {lucideLogOut} from '@ng-icons/lucide';
import {provideIcons} from '@ng-icons/core';
import {toast} from 'ngx-sonner';
import {AuthService} from '@core/services/auth.service';
import {Router} from '@angular/router';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    HlmIconComponent,],
  templateUrl: './header.component.html',
  providers: [provideIcons({ lucideLogOut})]
})
export class HeaderComponent {

  private router = inject(Router);
  private AuthService = inject(AuthService);

  logout() {
    this.AuthService.removeToken();
    if (this.AuthService.getToken() == null) {
      this.router.navigate(['/login']).then(() => {
        toast.info('Sesión cerrada correctamente');
      });
    }else{
      toast.error('Error al cerrar sesión');
    }
  }

  redirectToHomePage() {
    this.router.navigate(['/']);
  }
}
