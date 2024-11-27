import { Component, OnInit} from '@angular/core';
import { RequestCardComponent } from '@dashboard/components/request-card/request-card.component';
import {
  HlmTabsComponent,
  HlmTabsContentDirective,
  HlmTabsListComponent,
  HlmTabsTriggerDirective
} from '@spartan-ng/ui-tabs-helm';
import { CommonModule } from '@angular/common';
import { RequestService } from '@dashboard/services/request.service';
import { Request } from '@core/models/request.model';
import {HlmIconComponent} from '@spartan-ng/ui-icon-helm';
import {provideIcons} from '@ng-icons/core';
import {lucideCalendar, lucideEye, lucideMapPin, lucideUser2, lucideArrowUpRight, lucideArrowDownLeft} from '@ng-icons/lucide';
import {HlmH2Directive, HlmH3Directive} from '@spartan-ng/ui-typography-helm';

@Component({
  selector: 'app-adoption-requests',
  standalone: true,
  imports: [
    CommonModule,
    RequestCardComponent,
    HlmH3Directive,
    HlmH2Directive,
    HlmTabsComponent,
    HlmTabsListComponent,
    HlmTabsTriggerDirective,
    HlmTabsContentDirective,
    HlmIconComponent,
  ],
  templateUrl: './adoption-requests.component.html',
  providers: [provideIcons({ lucideMapPin, lucideUser2 , lucideCalendar, lucideEye, lucideArrowUpRight, lucideArrowDownLeft})]
})
export class AdoptionRequestsComponent implements OnInit   {
  requests: Request[] = [];

  constructor(
    private requestService: RequestService,
  ) {}

  ngOnInit(): void {
    this.fetchSentAdoptions();
  }

  fetchReceivedAdoptions() {
    this.requestService.getReceivedAdoptions().subscribe({
      next: (requests) => {
        this.requests = requests;
      }
    });
  }

  fetchSentAdoptions() {
    this.requestService.getSentAdoptions().subscribe({
      next: (requests) => {
        this.requests = requests;
        console.log(requests);
      }
    });
  }

}