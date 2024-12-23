import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HlmH2Directive, HlmH3Directive} from '@spartan-ng/ui-typography-helm';
import {StepperComponentComponent} from '@shared/components/stepper/stepper-component/stepper-component.component';
import {toast} from 'ngx-sonner';
import {Step} from '@shared/components/stepper/stepper-component/stepper-interfaces';
import {RequestService} from '@dashboard/services/request.service';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {ActivatedRoute, Router} from '@angular/router';
import {
  HlmAlertDialogActionButtonDirective,
  HlmAlertDialogCancelButtonDirective,
  HlmAlertDialogComponent,
  HlmAlertDialogContentComponent, HlmAlertDialogDescriptionDirective, HlmAlertDialogFooterComponent,
  HlmAlertDialogHeaderComponent, HlmAlertDialogOverlayDirective,
  HlmAlertDialogTitleDirective
} from '@spartan-ng/ui-alertdialog-helm';
import {BrnAlertDialogContentDirective, BrnAlertDialogTriggerDirective} from '@spartan-ng/ui-alertdialog-brain';
// @ts-ignore
import confetti from 'canvas-confetti';
import {ChatComponent} from '@shared/components/chat/chat.component';
import {NgIf} from '@angular/common';
import {BrnDialogContentDirective, BrnDialogTriggerDirective} from '@spartan-ng/ui-dialog-brain';
import {SignaturePadComponent} from '@shared/components/signature-pad/signature-pad.component';
import {
  HlmDialogComponent,
  HlmDialogContentComponent, HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent, HlmDialogTitleDirective
} from '@spartan-ng/ui-dialog-helm';

@Component({
  imports: [
    HlmH2Directive,
    StepperComponentComponent,
    HlmH3Directive,
    HlmButtonDirective,
    HlmAlertDialogActionButtonDirective,
    HlmAlertDialogCancelButtonDirective,
    HlmAlertDialogComponent,
    HlmAlertDialogContentComponent,
    HlmAlertDialogDescriptionDirective,
    HlmAlertDialogFooterComponent,
    HlmAlertDialogHeaderComponent,
    HlmAlertDialogOverlayDirective, // El IDE no reconoce esta directiva, pero se está usando
    HlmAlertDialogTitleDirective,
    BrnAlertDialogContentDirective, // El IDE no reconoce esta directiva, pero se está usando
    BrnAlertDialogTriggerDirective,
    ChatComponent,
    NgIf,
    BrnDialogTriggerDirective,
    SignaturePadComponent,
    BrnDialogContentDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
  ],
  selector: 'app-adoption-tracking-page',
  standalone: true,
  templateUrl: './adoption-tracking-page.component.html'
})
export class AdoptionTrackingPageComponent implements OnInit {
  @ViewChild('stepOne') stepOne!: TemplateRef<any>;
  @ViewChild('stepTwo') stepTwo!: TemplateRef<any>;
  @ViewChild('stepThree') stepThree!: TemplateRef<any>;
  @ViewChild(StepperComponentComponent) stepper!: StepperComponentComponent;
  @ViewChild(HlmDialogComponent) dialog!: HlmDialogComponent;
  @ViewChild(HlmAlertDialogComponent) alertDialog!: HlmAlertDialogComponent;
  @ViewChild(SignaturePadComponent) signaturePad!: SignaturePadComponent;

  steps: Step[] = [];
  requestCode: string = '';
  chatRoomCode: string = '';
  status: number = 0;

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.requestCode = params['requestCode'];

      this.requestService.getRequestStatus(this.requestCode).subscribe({
        next: (requestStatusResponse) => {
          const { status, chatRoomCode } = requestStatusResponse;

          const stepOne = status === 0;
          const stepTwo = status === 1 || status === 2 || status === 3;
          const stepThree = status === 4 || status === 5;
          const finished = status === 5;

          this.status = status;

          if ([2,4,5].includes(status)) {
            if (chatRoomCode != undefined) {
              this.chatRoomCode = chatRoomCode;
            }

            if (status === 2) {
              this.confetti();
              localStorage.setItem('confettiShown', 'true');
            }
          }

          setTimeout(() => {
            this.steps = [
              {
                title: 'Primer Paso',
                description: 'Revisión de la solicitud',
                isActive: stepOne,
                isCompleted: stepTwo || stepThree || finished,
                disabled: true,
                content: this.stepOne
              },
              {
                title: 'Segundo Paso',
                description: 'Resolución de la solicitud',
                isActive: stepTwo,
                isCompleted: stepThree || finished,
                disabled: true,
                content: this.stepTwo
              },
              {
                title: 'Tercer Paso',
                description: 'Contrato de adopción',
                isActive: stepThree,
                isCompleted: finished,
                disabled: true,
                content: this.stepThree
              }
            ];
          });
        },
        error: () => {
          this.router.navigate(['/dashboard']).then(() => toast.error('No se pudo obtener el estado de la solicitud, inténtelo de nuevo más tarde'));
        }
      });
    });
  }

  confetti() {
    if (localStorage.getItem('confettiShown')) return;

    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {startVelocity: 30, spread: 360, ticks: 60, zIndex: 0};

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({...defaults, particleCount, origin: {x: randomInRange(0.1, 0.3), y: Math.random() - 0.2}});
      confetti({...defaults, particleCount, origin: {x: randomInRange(0.7, 0.9), y: Math.random() - 0.2}});
    }, 250);
  }

  downloadPdf() {
    if (!this.requestCode) return;

    this.requestService.downloadRequestPdf(this.requestCode);
  }

  downloadContract() {
    toast.info('Descargando contrato de adopción', { description: 'El contrato se descargará automáticamente' });
    this.requestService.downloadAdoptionContract(this.requestCode);
  }

  closeAll() {
    this.dialog.close(1);
    this.alertDialog.close(1);
  }

  checkSignature() {
    if (this.signaturePad.isCanvasBlank()) {
      toast.error('Firma no encontrada', { description: 'Por favor, firma el contrato antes de continuar' });
      return;
    }

    this.alertDialog.open();
  }

  signContract() {
    if (!this.requestCode) return;

    this.closeAll();

    this.requestService.signContract(this.requestCode, { signature: this.signaturePad.getImage(), isOwner: false }).subscribe({
      next: () => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/adoption/tracking/' + this.requestCode]).then(() => {
            toast.info('Has firmado el contrato de adopción', { description: 'Ahora puedes descargar el contrato' });
          });
        });
      },
      error: () => {
        toast.error('Ha ocurrido un error al firmar el contrato de adopción');
      }
    });
  }

}
