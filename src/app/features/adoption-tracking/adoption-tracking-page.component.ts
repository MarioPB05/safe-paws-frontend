import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HlmH2Directive, HlmH3Directive} from '@spartan-ng/ui-typography-helm';
import {StepperComponentComponent} from '@shared/components/stepper/stepper-component/stepper-component.component';
import {toast} from 'ngx-sonner';
import {Step} from '@shared/components/stepper/stepper-component/stepper-interfaces';
import {RequestService} from '@dashboard/services/request.service';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {ActivatedRoute} from '@angular/router';
import {
  HlmAlertDialogActionButtonDirective,
  HlmAlertDialogCancelButtonDirective,
  HlmAlertDialogComponent,
  HlmAlertDialogContentComponent, HlmAlertDialogDescriptionDirective, HlmAlertDialogFooterComponent,
  HlmAlertDialogHeaderComponent, HlmAlertDialogOverlayDirective,
  HlmAlertDialogTitleDirective
} from '@spartan-ng/ui-alertdialog-helm';
import {BrnAlertDialogContentDirective, BrnAlertDialogTriggerDirective} from '@spartan-ng/ui-alertdialog-brain';

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
  ],
  selector: 'app-adoption-tracking-page',
  standalone: true,
  templateUrl: './adoption-tracking-page.component.html'
})
export class AdoptionTrackingPageComponent implements OnInit, AfterViewInit {
  @ViewChild('stepOne') stepOne!: TemplateRef<any>;
  @ViewChild('stepTwo') stepTwo!: TemplateRef<any>;
  @ViewChild('stepThree') stepThree!: TemplateRef<any>;

  steps: Step[] = [];
  requestCode: string = '';

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.requestCode = params['requestCode'];
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.steps = [
        {
          title: 'Primer Paso',
          description: 'Revisión de la solicitud',
          isActive: true,
          isCompleted: false,
          disabled: true,
          content: this.stepOne
        },
        {
          title: 'Segundo Paso',
          description: 'Resolución de la solicitud',
          isActive: false,
          isCompleted: false,
          disabled: true,
          content: this.stepTwo
        },
        {
          title: 'Tercer Paso',
          description: 'Contrato de adopción',
          isActive: false,
          isCompleted: false,
          disabled: true,
          content: this.stepThree
        }
      ];
    });
  }

  downloadPdf() {
    if (!this.requestCode) return;

    this.requestService.getRequestPdf(this.requestCode).subscribe({
      next: (pdfBlob) => {
        // SImulate a file download
        const file = new Blob([pdfBlob], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);

        const a = document.createElement('a');
        a.href = fileURL;
        a.download = 'adoption_request_' + this.requestCode + '.pdf';
        a.click();
      },
      error: () => {
        toast.error('No se pudo descargar el archivo PDF');
      }
    })
  }

}
