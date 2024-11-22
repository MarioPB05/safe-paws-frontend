import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardPageComponent } from '@dashboard/pages/dashboard-page.component';
import { AdoptionsPageComponent } from '@dashboard/pages/adoptions/adoptions-page.component';
import { DashboardRoutingModule } from '@dashboard/dashboard.routes';
import {AdoptionRequestsComponent} from '@dashboard/pages/adoption-requests/adoption-requests.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DashboardPageComponent,
    AdoptionsPageComponent,
    DashboardRoutingModule,
    AdoptionRequestsComponent
  ]
})
export class DashboardModule { }
