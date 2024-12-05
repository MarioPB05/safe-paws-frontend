import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HlmH3Directive} from '@spartan-ng/ui-typography-helm';
import {ActivatedRoute, Router} from '@angular/router';
import {AdoptionService} from '@dashboard/services/adoption.service';
import {AdoptionAvailable} from '@core/models/adoption.model';
import {HlmSwitchComponent} from '@spartan-ng/ui-switch-helm';
import {toast} from 'ngx-sonner';
import {
  StepperComponentComponent
} from '@features/adoption-form/components/stepper-component/stepper-component.component';
import {Step} from '@features/adoption-form/components/stepper-component/stepper-interfaces';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [
    HlmH3Directive,
    HlmSwitchComponent,
    StepperComponentComponent
  ],
  templateUrl: './adoption-form-page.component.html',
})
export class AdoptionFormPageComponent implements OnInit {
  @ViewChild('stepOne') stepOne!: TemplateRef<any>;
  @ViewChild('stepTwo') stepTwo!: TemplateRef<any>;
  @ViewChild('stepThree') stepThree!: TemplateRef<any>;

  steps: Step[] = [];

  public adoptionId: number = -1;
  public adoptionDetails: AdoptionAvailable | undefined;
  private router = inject(Router);

  constructor(
    private route: ActivatedRoute,
    private adoptionService: AdoptionService
  ) {}

  ngOnInit() {
    this.steps = [
      {
        title: 'Primer Paso',
        description: 'Detalles de la mascota',
        isActive: true,
        isCompleted: false,
        content: this.stepOne
      },
      {
        title: 'Segundo Paso',
        description: 'Formulario de adopción',
        isActive: false,
        isCompleted: false,
        content: this.stepTwo
      },
      {
        title: 'Tercer Paso',
        description: 'Confirmación',
        isActive: false,
        isCompleted: false,
        content: this.stepThree
      }
    ];

    this.route.params.subscribe(params => {
      this.adoptionId = params['id'];

      this.adoptionService.getAdoptionDetail(this.adoptionId).subscribe({
        next: (adoption) => {
          this.adoptionDetails = adoption;
        },
        error: () => {
          this.router.navigate(['/dashboard']).then(() => toast.error('No se ha podido cargar los detalles de la adopción'));
        }
      });
    });
  }

}
