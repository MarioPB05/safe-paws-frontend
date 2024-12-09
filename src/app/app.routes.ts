import { Routes } from '@angular/router';
import { HomeComponent } from '@features/home/home.component';
import {authGuard} from '@core/guards/auth.guard';
import {LoginComponent} from '@features/auth/login.component';
import { CreateAdoptionPageComponent } from '@features/create-adoption/pages/create-adoption-page.component';
import {RegisterComponent} from '@features/auth/register.component';
import {AdoptionFormPageComponent} from '@features/adoption-form/adoption-form-page.component';
import {AdoptionTrackingPageComponent} from '@features/adoption-tracking/adoption-tracking-page.component';
import {ChatPageComponent} from '@features/chat/chat-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    loadChildren: () => import('@dashboard/dashboard.module').then(
      m => m.DashboardModule
    ),
    canActivate: [authGuard],
  },
  { path: 'new/adoption', component: CreateAdoptionPageComponent, canActivate: [authGuard]},
  { path: 'adoption/:id/form', component: AdoptionFormPageComponent, canActivate: [authGuard]},
  { path: 'adoption/tracking/:requestCode', component: AdoptionTrackingPageComponent, canActivate: [authGuard]},
  { path: 'chat/:roomCode', component: ChatPageComponent, canActivate: [authGuard]},
];
