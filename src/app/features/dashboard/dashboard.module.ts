import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardPageComponent } from '@dashboard/pages/dashboard-page.component';
import { AdoptionsPageComponent } from '@dashboard/pages/adoptions/adoptions-page.component';
import { DashboardRoutingModule } from '@dashboard/dashboard.routes';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DashboardPageComponent,
    AdoptionsPageComponent,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
