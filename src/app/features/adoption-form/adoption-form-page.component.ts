import {AfterViewInit, Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HlmH2Directive, HlmH3Directive, HlmUlDirective} from '@spartan-ng/ui-typography-helm';
import {ActivatedRoute, Router} from '@angular/router';
import {AdoptionService} from '@dashboard/services/adoption.service';
import {AdoptionAvailable} from '@core/models/adoption.model';
import {HlmSwitchComponent} from '@spartan-ng/ui-switch-helm';
import {toast} from 'ngx-sonner';
import {
  StepperComponentComponent
} from '@shared/components/stepper/stepper-component/stepper-component.component';
import {Step} from '@shared/components/stepper/stepper-component/stepper-interfaces';
import {forkJoin} from 'rxjs';
import {EnumService} from '@core/services/enum.service';
import {MapService} from '@shared/services/map.service';
import {Location, LocationError} from '@core/models/map.model';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {QuestionService} from '@features/adoption-form/services/question.service';
import {QuestionsAvailable} from '@core/models/question.model';
import {HlmLabelDirective} from '@spartan-ng/ui-label-helm';
import {NgClass, NgIf} from '@angular/common';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {FormsModule} from '@angular/forms';
import {HlmProgressIndicatorDirective} from '@spartan-ng/ui-progress-helm';
import {BrnProgressComponent, BrnProgressIndicatorComponent} from '@spartan-ng/ui-progress-brain';
import {CreateRequest} from '@core/models/request.model';
import {CreateRequestAnswer} from '@core/models/requestanswer.model';
import {RequestService} from '@dashboard/services/request.service';

interface AdoptionDetail extends AdoptionAvailable {
  animalType: string;
  fullAddress: string;
}

interface Question extends QuestionsAvailable {
  subQuestion?: Question;
  value?: string | number | boolean;
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
    HlmInputDirective,
    FormsModule,
    BrnProgressComponent,
    BrnProgressIndicatorComponent,
    HlmProgressIndicatorDirective,
    NgClass
  ],
  templateUrl: './adoption-form-page.component.html',
})
export class AdoptionFormPageComponent implements OnInit, AfterViewInit {
  @ViewChild('stepOne') stepOne!: TemplateRef<any>;
  @ViewChild('stepTwo') stepTwo!: TemplateRef<any>;
  @ViewChild('stepThree') stepThree!: TemplateRef<any>;
  @ViewChild(StepperComponentComponent) stepper!: StepperComponentComponent;

  steps: Step[] = [];
  disableNext = false;
  lastQuestion = false;
  currentProgress = 0;
  message = '';

  public adoptionId: number = -1;
  public adoptionDetails: AdoptionDetail | undefined;
  public questions: Question[] = [];
  public currentQuestionIndex = 0;
  private router = inject(Router);
  private dto?: CreateRequest;

  constructor(
    private route: ActivatedRoute,
    private adoptionService: AdoptionService,
    private enumService: EnumService,
    private mapService: MapService,
    private questionService: QuestionService,
    private requestService: RequestService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.adoptionId = params['id'];

      forkJoin({
        adoptionAvailable: this.adoptionService.checkRequest(this.adoptionId),
        animalTypes: this.enumService.getAnimalTypes(),
        adoptionDetail: this.adoptionService.getAdoptionDetail(this.adoptionId)
      }).subscribe({
        next: ({adoptionAvailable, animalTypes, adoptionDetail}) => {
          if (!adoptionAvailable.available && adoptionAvailable.requestCode != null) {
            this.router.navigate([`/adoption/tracking/${adoptionAvailable.requestCode}`]).then(() => toast.error('Ya has enviado una solicitud para esta adopción'));
            return;
          }

          const animalType = animalTypes.find(({id}) => id === adoptionDetail.typeId);

          this.adoptionDetails = {
            ...adoptionDetail,
            animalType: animalType?.name || 'Desconocido',
            fullAddress: 'Cargando...'
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
          onClick: () => { this.disableNext = false },
          onNext: this.getQuestions.bind(this),
        },
        {
          title: 'Segundo Paso',
          description: 'Formulario de adopción',
          isActive: false,
          isCompleted: false,
          content: this.stepTwo,
          onClick: this.getQuestions.bind(this),
          onNext: () => { this.disableNext = false },
          onPrevious: () => { this.disableNext = false },
        },
        {
          title: 'Tercer Paso',
          description: 'Confirmación',
          isActive: false,
          isCompleted: false,
          content: this.stepThree,
          onClick: () => {
            if (!this.lastQuestion) {
              toast.error('Por favor responde todas las preguntas antes de continuar');
              return false;
            }

            return true;
          },
          onPrevious: () => { this.disableNext = true },
        }
      ];
    });
  }

  getQuestions() {
    this.disableNext = true;

    if (this.questions.length) return;

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
      },
      error: () => {
        toast.error('No se pudo cargar las preguntas');
      }
    });
  }

  previousQuestion() {
    this.currentQuestionIndex--;

    if (this.currentQuestionIndex === 0) {
      this.setProgress(0);
    }else {
      this.setProgress(null);
    }

    this.lastQuestion = false;
  }

  nextQuestion() {
    if (this.currentQuestionIndex === this.questions.length - 1) {
      this.saveQuestions();
      this.stepper.next();
      return;
    }

    console.log(this.questions[this.currentQuestionIndex].value);

    const value = this.questions[this.currentQuestionIndex].value;

    if (this.questions[this.currentQuestionIndex].type === 3 && value == undefined && this.questions[this.currentQuestionIndex].required) {
      this.questions[this.currentQuestionIndex].value = false; // Si no se responde una pregunta de tipo booleano, se asume como false
    }else if (this.questions[this.currentQuestionIndex].required && (value === '' || value === null || value === undefined || (this.questions[this.currentQuestionIndex].type != 3 && (value as string).trim() === ''))) {
      toast.error('Esta pregunta es obligatoria, por favor responde antes de continuar');
      return;
    }

    console.log(this.questions[this.currentQuestionIndex].value);

    if (this.currentQuestionIndex  + 1 === this.questions.length - 1) {
      this.lastQuestion = true;
    }

    this.setProgress(null, true);

    if (this.lastQuestion) this.setProgress(100);

    this.currentQuestionIndex++;
  }

  setProgress(progress: number | null, increase = false): void {
    if (progress === null) {
      const baseIndex = increase ? this.currentQuestionIndex + 1 : this.currentQuestionIndex;

      const clampedIndex = Math.min(Math.max(baseIndex, 0), this.questions.length);

      progress = (clampedIndex / this.questions.length) * 100;
    }

    this.currentProgress = Math.max(0, Math.min(progress, 100)); // Clampa entre 0 y 100
  }

  saveQuestions() {
    const answers: CreateRequestAnswer[] = [];
    this.questions.forEach((question) => {
      if (question.value !== undefined) {
        answers.push({
          questionId: question.id,
          answer: question.value as string
        });
      }
    });

    this.dto = {
      message: this.message,
      postId: this.adoptionId,
      answers: answers
    };
  }

  saveRequest() {
    if (!this.dto) return;

    if (this.message === '' || this.message.trim() == '' || this.message == ' ') {
      toast.error('Por favor, escribe un mensaje para el dueño del animal');
      return;
    }

    this.disableNext = true;
    this.dto.message = this.message;

    this.requestService.createRequest(this.dto).subscribe({
      next: (requestCode) => {
        this.router.navigate([`/adoption/tracking/${requestCode}`]).then(() => {});
      },
      error: (e) => {
        console.log(e);
        toast.error('No se pudo enviar la solicitud de adopción, por favor intenta de nuevo más tarde');
      },
      complete: () => {
        this.disableNext = false;
      }
    });
  }

}
