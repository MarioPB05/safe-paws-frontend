import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from '@dashboard/components/header/header.component';
import {NavbarComponent} from '@dashboard/components/navbar/navbar.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    NavbarComponent
  ],
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent {

}
