import { Routes } from '@angular/router';
import { HomeComponent } from '@features/home/home.component';
import {authGuard} from '@core/guards/auth.guard';
import {LoginComponent} from '@features/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    loadChildren: () => import('@dashboard/dashboard.module').then(
      m => m.DashboardModule
    ),
    canActivate: [authGuard],
  }
];
