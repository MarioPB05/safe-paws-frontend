import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '@core/services/auth.service';
import {map} from 'rxjs';
import {toast} from 'ngx-sonner';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(['/login']).then(() => {
          toast.error('No tienes una sesión activa, por favor inicia sesión');
        });
        return false;
      }
      return true;
    })
  );
};
