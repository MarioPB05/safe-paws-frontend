import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPageComponent } from '@dashboard/pages/dashboard-page.component';
import { AdoptionsPageComponent } from '@dashboard/pages/adoptions/adoptions-page.component';
import {AdoptionRequestsComponent} from '@dashboard/pages/adoption-requests/adoption-requests.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardPageComponent,
    children: [
      {
        path: 'adoptions',
        component: AdoptionsPageComponent,
      },
      {
        path: 'requests',
        component: AdoptionRequestsComponent
      },
      {
        path: '',
        redirectTo: 'adoptions',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
