import {ChangeDetectorRef, Component, HostBinding, OnInit, ViewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from '@dashboard/components/header/header.component';
import {NavbarComponent} from '@dashboard/components/navbar/navbar.component';
import {DashboardService} from '@dashboard/services/dashboard.service';

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
export class DashboardPageComponent implements OnInit {
  @HostBinding('class') class = '';
  private readonly defaultClass: string = 'flex flex-col pb-36';

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dashboardService.getCurrentCustomClass().subscribe(customClass => {
      this.class = `${this.defaultClass} ${customClass}`;
      this.cdr.detectChanges();
    });
  }

}
