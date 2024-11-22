import { Component, Input } from '@angular/core';
import { HlmBadgeDirective } from '../../../../../libs/ui/ui-badge-helm/src';
import { HlmH3Directive, HlmPDirective } from '@spartan-ng/ui-typography-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideMapPin, lucideUser2,lucideCalendar, lucideEye, lucideMessagesSquare } from '@ng-icons/lucide';
import { Request } from '@core/models/request.model';
import {NgClass, NgIf} from '@angular/common';
import dayjs from 'dayjs';

@Component({
  selector: 'app-request-card',
  standalone: true,
  imports: [
    HlmBadgeDirective,
    HlmH3Directive,
    HlmPDirective,
    HlmIconComponent,
    NgIf,
    NgClass,
  ],
  templateUrl: './request-card.component.html',
  providers: [provideIcons({ lucideMapPin, lucideUser2 , lucideCalendar, lucideEye, lucideMessagesSquare})]
})
export class RequestCardComponent {


  @Input() request!: Request;
  @Input() mode = 'received' as 'received' | 'sent';

  getDaysElapsed(): number {
    const requestSentDate = dayjs(this.request.requestDate);
    const currentDate = dayjs();
    return currentDate.diff(requestSentDate, 'day');
  }

  getFormattedDate(): string {
    const requestSentDate = dayjs(this.request.requestDate);
    if (requestSentDate.isValid()) {
      return requestSentDate.format('DD/MM/YYYY');
    } else {
      return 'Invalid Date';
    }
  }

  formatStatus(): string {
    switch (this.request.requestStatus) {
      case 2:
        return 'Approved';
      case 0:
        return 'Pending';
      case 1:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  }
  getStatusClass(): string {
    switch (this.request.requestStatus) {
      case 2:
        return 'bg-green-500';
      case 0:
        return 'bg-yellow-500';
      case 1:
        return 'bg-red-500';

      default:
        return 'bg-gray-500';
    }
  }


}
