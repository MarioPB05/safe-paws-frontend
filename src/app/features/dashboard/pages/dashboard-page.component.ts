import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
    imports: [
        RouterOutlet
    ],
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent {

}
