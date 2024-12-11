import {Component, Input, ViewChild} from '@angular/core';
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
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent, HlmDialogHeaderComponent,
  HlmDialogTitleDirective
} from '@spartan-ng/ui-dialog-helm';
import {BrnDialogContentDirective, BrnDialogTriggerDirective} from '@spartan-ng/ui-dialog-brain';
import {SignaturePadComponent} from '@shared/components/signature-pad/signature-pad.component';
import {BrnAlertDialogContentDirective, BrnAlertDialogTriggerDirective} from '@spartan-ng/ui-alertdialog-brain';
import {
  HlmAlertDialogActionButtonDirective,
  HlmAlertDialogCancelButtonDirective,
  HlmAlertDialogComponent,
  HlmAlertDialogContentComponent,
  HlmAlertDialogDescriptionDirective,
  HlmAlertDialogFooterComponent,
  HlmAlertDialogHeaderComponent,
  HlmAlertDialogOverlayDirective,
  HlmAlertDialogTitleDirective
} from '@spartan-ng/ui-alertdialog-helm';

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
    BrnDialogTriggerDirective,
    BrnDialogContentDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    HlmButtonDirective,
    SignaturePadComponent,
    BrnAlertDialogTriggerDirective,
    BrnAlertDialogContentDirective,
    HlmAlertDialogComponent,
    HlmAlertDialogOverlayDirective,
    HlmAlertDialogHeaderComponent,
    HlmAlertDialogFooterComponent,
    HlmAlertDialogTitleDirective,
    HlmAlertDialogDescriptionDirective,
    HlmAlertDialogCancelButtonDirective,
    HlmAlertDialogActionButtonDirective,
    HlmAlertDialogContentComponent,
  ],
  templateUrl: './request-card.component.html',
  providers: [provideIcons({ lucideMapPin, lucideUser2 , lucideCalendar, lucideEye, lucideMessagesSquare})]
})
export class RequestCardComponent {
  @Input() request!: Request;
  @Input() mode = 'received' as 'received' | 'sent';
  @ViewChild(HlmSheetComponent) sheet!: HlmSheetComponent;
  @ViewChild(HlmDialogComponent) dialog!: HlmDialogComponent;
  @ViewChild(HlmAlertDialogComponent) alertDialog!: HlmAlertDialogComponent;
  @ViewChild(SignaturePadComponent) signaturePad!: SignaturePadComponent;

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
      case 4:
      case 5:
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
    this.sheet.close(1);
    toast.info('Descargando PDF', { description: 'La solicitud de adopción se descargará automáticamente' });
    this.requestService.downloadRequestPdf(code);
  }

  acceptRequest(code: string): void {
    this.sheet.close(1);

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

  rejectRequest(code: string): void {
    this.sheet.close(1);

    this.requestService.rejectRequest(code).subscribe({
      next: () => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/dashboard/requests']).then(() => {
            toast.info('Has rechazado la petición de adopción', { description: 'El solicitante ha sido notificado' });
          });
        });
      },
      error: () => {
        toast.error('Ha ocurrido un error al rechazar la petición de adopción');
      }
    });
  }

  downloadContract(code: string) {
    this.sheet.close(1);
    toast.info('Descargando contrato de adopción', { description: 'El contrato se descargará automáticamente' });
    this.requestService.downloadAdoptionContract(code);
  }

  checkSignature() {
    if (this.signaturePad.isCanvasBlank()) {
      toast.error('Firma no encontrada', { description: 'Por favor, firma el contrato antes de continuar' });
      return;
    }

    this.alertDialog.open();
  }

  closeAll() {
    this.dialog.close(1);
    this.alertDialog.close(1);
  }

  signContract(code: string) {
    this.requestService.signContract(code, { signature: this.signaturePad.getImage(), isOwner: true }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']).then(() => {
          toast.info('Has firmado el contrato de adopción', { description: 'Ahora debes esperar a que el adoptante firme el contrato' });
        });
      },
      error: () => {
        toast.error('Ha ocurrido un error al firmar el contrato de adopción');
      }
    });
  }

  redirectToTrackingPage(code: string) {
    this.router.navigate(['adoption/tracking/' + code]);
  }

}
