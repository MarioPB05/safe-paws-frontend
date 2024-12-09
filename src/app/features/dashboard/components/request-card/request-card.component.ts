import { Component, Input } from '@angular/core';
import { HlmBadgeDirective } from '../../../../../libs/ui/ui-badge-helm/src';
import { HlmH3Directive, HlmPDirective } from '@spartan-ng/ui-typography-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideMapPin, lucideUser2,lucideCalendar, lucideEye, lucideMessagesSquare } from '@ng-icons/lucide';
import { Request } from '@core/models/request.model';
import {NgClass, NgIf} from '@angular/common';
import { BrnSheetContentDirective, BrnSheetTriggerDirective } from '@spartan-ng/ui-sheet-brain';
import {
  HlmSheetComponent,
  HlmSheetContentComponent,
  HlmSheetDescriptionDirective,
  HlmSheetFooterComponent,
  HlmSheetHeaderComponent,
  HlmSheetTitleDirective,
} from '@spartan-ng/ui-sheet-helm';
import dayjs from 'dayjs';
import {RequestService} from '@dashboard/services/request.service';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {Router} from '@angular/router';
import {toast} from 'ngx-sonner';

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
    HlmSheetComponent,
    HlmSheetContentComponent,
    HlmSheetDescriptionDirective,
    HlmSheetFooterComponent,
    HlmSheetHeaderComponent,
    HlmSheetTitleDirective,
    BrnSheetTriggerDirective,
    BrnSheetContentDirective,
    HlmButtonDirective,
  ],
  templateUrl: './request-card.component.html',
  providers: [provideIcons({ lucideMapPin, lucideUser2 , lucideCalendar, lucideEye, lucideMessagesSquare})]
})
export class RequestCardComponent {
  @Input() request!: Request;
  @Input() mode = 'received' as 'received' | 'sent';

  constructor(
    private requestService: RequestService,
    private router: Router
  ) {}

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

  downloadPdf(code: string): void {
    this.requestService.downloadRequestPdf(code);
  }

  acceptRequest(code: string): void {
    this.requestService.acceptRequest(code).subscribe({
      next: (chatCode) => {
        this.router.navigate(['/chat/' + chatCode]).then(() => {
          toast.info('Has aceptado la petición de adopción', { description: 'Ahora puedes chatear con el solicitante' });
        })
      },
      error: () => {
        toast.error('Ha ocurrido un error al aceptar la petición de adopción');
      }
    });
  }

}
