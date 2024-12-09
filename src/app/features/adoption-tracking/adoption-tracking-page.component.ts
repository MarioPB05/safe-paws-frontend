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
import {AuthService} from '@core/services/auth.service';
import {ChatComponent} from '@shared/components/chat/chat.component';

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

  steps: Step[] = [];
  requestCode: string = '';
  status: number = 0;

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.requestCode = params['requestCode'];

      this.requestService.getRequestStatus(this.requestCode).subscribe({
        next: (requestStatusResponse) => {
          const { status } = requestStatusResponse;

          const stepOne = status === 0;
          const stepTwo = status === 1 || status === 2 || status === 3;
          const stepThree = status === 4;
          const finished = status === 5;

          this.status = status;

          if (status === 2) {
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

  downloadPdf() {
    if (!this.requestCode) return;

    this.requestService.downloadRequestPdf(this.requestCode);
  }

}
