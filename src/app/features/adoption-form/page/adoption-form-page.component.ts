import {AfterViewInit, Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HlmH2Directive, HlmH3Directive, HlmUlDirective} from '@spartan-ng/ui-typography-helm';
import {ActivatedRoute, Router} from '@angular/router';
import {AdoptionService} from '@dashboard/services/adoption.service';
import {AdoptionAvailable} from '@core/models/adoption.model';
import {HlmSwitchComponent} from '@spartan-ng/ui-switch-helm';
import {toast} from 'ngx-sonner';
import {
  StepperComponentComponent
} from '@features/adoption-form/components/stepper-component/stepper-component.component';
import {Step} from '@features/adoption-form/components/stepper-component/stepper-interfaces';
import {forkJoin} from 'rxjs';
import {EnumService} from '@core/services/enum.service';
import {MapService} from '@shared/services/map.service';
import {Location, LocationError} from '@core/models/map.model';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {QuestionService} from '@features/adoption-form/services/question.service';
import {QuestionsAvailable} from '@core/models/question.model';
import {HlmLabelDirective} from '@spartan-ng/ui-label-helm';
import {NgIf} from '@angular/common';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';

interface AdoptionDetail extends AdoptionAvailable {
  animalType: string;
  fullAddress: string;
}

interface Question extends QuestionsAvailable {
  subQuestion?: QuestionsAvailable;
}

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [
    HlmH3Directive,
    HlmSwitchComponent,
    StepperComponentComponent,
    HlmH2Directive,
    HlmUlDirective,
    HlmButtonDirective,
    HlmLabelDirective,
    NgIf,
    HlmInputDirective
  ],
  templateUrl: './adoption-form-page.component.html',
})
export class AdoptionFormPageComponent implements OnInit, AfterViewInit {
  @ViewChild('stepOne') stepOne!: TemplateRef<any>;
  @ViewChild('stepTwo') stepTwo!: TemplateRef<any>;
  @ViewChild('stepThree') stepThree!: TemplateRef<any>;

  steps: Step[] = [];
  disableNext = false;

  public adoptionId: number = -1;
  public adoptionDetails: AdoptionDetail | undefined;
  public questions: Question[] = [];
  public currentQuestionIndex = 0;
  private router = inject(Router);

  constructor(
    private route: ActivatedRoute,
    private adoptionService: AdoptionService,
    private enumService: EnumService,
    private mapService: MapService,
    private questionService: QuestionService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.adoptionId = params['id'];

      forkJoin({
        animalTypes: this.enumService.getAnimalTypes(),
        adoptionDetail: this.adoptionService.getAdoptionDetail(this.adoptionId)
      }).subscribe({
        next: ({animalTypes, adoptionDetail}) => {
          const animalType = animalTypes.find(({id}) => id === adoptionDetail.typeId);

          this.adoptionDetails = {
            ...adoptionDetail,
            animalType: animalType?.name || 'Desconocido',
            fullAddress: ''
          };

          if (this.adoptionDetails) {
            this.mapService.getLocation(this.adoptionDetails.coordinateY, this.adoptionDetails.coordinateX).subscribe({
              next: (location) => {
                if ((location as LocationError).error) {
                  this.router.navigate(['/dashboard']).then(() => toast.error('Error al obtener la ubicación.'));
                  return;
                }

                location = location as Location;

                this.adoptionDetails!.fullAddress = location.display_name;
              }
            });
          }
        },
        error: () => {
          toast.error('No se pudo cargar los detalles del animal');
        }
      })
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.steps = [
        {
          title: 'Primer Paso',
          description: 'Detalles de la mascota',
          isActive: true,
          isCompleted: false,
          content: this.stepOne,
          onClick: () => this.disableNext = false,
          onNext: this.getQuestions.bind(this),
        },
        {
          title: 'Segundo Paso',
          description: 'Formulario de adopción',
          isActive: false,
          isCompleted: false,
          content: this.stepTwo,
          onClick: this.getQuestions.bind(this),
          onNext: () => this.disableNext = false,
          onPrevious: () => this.disableNext = false,
        },
        {
          title: 'Tercer Paso',
          description: 'Confirmación',
          isActive: false,
          isCompleted: false,
          content: this.stepThree
        }
      ];
    });
  }

  getQuestions() {
    this.disableNext = true;

    this.questionService.getQuestions().subscribe({
      next: (questions) => {
        this.questions = questions;

        [...this.questions].forEach((question) => {
          let subQuestionId: number;
          const subQuestion = this.questions.find((q) => {
            if (q.requiredQuestionId === question.id) {
              subQuestionId = q.id;
              return true;
            }

            return false;
          });

          if (subQuestion) {
            question.subQuestion = subQuestion;

            this.questions = this.questions.filter((question) => question.id !== subQuestionId);
          }
        });

        console.log(this.questions);
      },
      error: () => {
        toast.error('No se pudo cargar las preguntas');
      }
    });
  }

  previousQuestion() {
    this.currentQuestionIndex--;
  }

  nextQuestion() {
    this.currentQuestionIndex++;
  }

}
