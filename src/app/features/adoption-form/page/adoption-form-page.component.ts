import {Component, inject} from '@angular/core';
import {HlmH1Directive, HlmH2Directive, HlmH3Directive, HlmPDirective} from '@spartan-ng/ui-typography-helm';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {HlmLabelDirective} from '@spartan-ng/ui-label-helm';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {ActivatedRoute, Router} from '@angular/router';
import {AdoptionService} from '@dashboard/services/adoption.service';
import {AdoptionAvailable} from '@core/models/adoption.model';
import {QuestionComponent} from '@features/adoption-form/components/question/question.component';
import {QuestionsAvailable} from '@core/models/question.model';
import {QuestionService} from '@features/adoption-form/services/question.service';
import {AdoptionCardComponent} from '@dashboard/components/adoption-card/adoption-card.component';
import {NgForOf, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HlmFormFieldComponent, HlmErrorDirective} from '@spartan-ng/ui-formfield-helm';
import {HlmSwitchComponent} from '@spartan-ng/ui-switch-helm';


@Component({
  selector: 'app-page',
  standalone: true,
  imports: [
    HlmH1Directive,
    HlmH2Directive,
    HlmH3Directive,
    HlmPDirective,
    HlmInputDirective,
    HlmLabelDirective,
    HlmButtonDirective,
    QuestionComponent,
    AdoptionCardComponent,
    NgForOf,
    ReactiveFormsModule,
    HlmFormFieldComponent,
    HlmSwitchComponent,
    HlmErrorDirective,
    NgIf
  ],
  templateUrl: './adoption-form-page.component.html',
})
export class AdoptionFormPageComponent {
  public adoptionId: number = -1;
  questions: QuestionsAvailable[] = [];
  public adoptionDetails: AdoptionAvailable | undefined;
  private router = inject(Router);
  public form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private adoptionService: AdoptionService,
    private questionService: QuestionService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({});
  }



  ngOnInit() {
    this.getQuestions();
    this.route.params.subscribe(params => {
      this.adoptionId = params['id'];
      this.adoptionService.getAdoptionDetail(this.adoptionId).subscribe({
        next: (adoption) => {
          this.adoptionDetails = adoption;
        },
        error: (err) => {
          console.error(err);
        }
      });
    });
  }

  getQuestions() {
    this.questionService.getQuestions().subscribe({
      next: questions => {
        this.questions = this.orderQuestionsByRequired(questions).map(question => ({
          ...question,
          isCompleted: false
        }));
      },
      error: err => {
        console.error(err);
      },
    });
  }


  redirectToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  initializeForm() {
    this.questions.forEach((question) => {
      // Se crean los controles con las validaciones necesarias
      const control = this.fb.control(
        { value: '', disabled: !!question.requiredQuestionId }, // Deshabilitar si depende de otra
        question.requiredQuestionId ? [] : [Validators.required] // Solo obligatorio si no depende
      );

      this.form.addControl(question.id.toString(), control);

      // Si la pregunta depende de otra, se configura el comportamiento de habilitación/deshabilitación
      if (question.requiredQuestionId) {
        const requiredControl = this.form.get(question.requiredQuestionId.toString());
        requiredControl?.valueChanges.subscribe((value) => {
          const currentControl = this.form.get(question.id.toString());
          if (value) {
            currentControl?.enable();
          } else {
            currentControl?.disable();
            currentControl?.reset();
          }
        });
      }
    });
  }

  orderQuestionsByRequired(questions: QuestionsAvailable[]): QuestionsAvailable[] {
    const sortedQuestions: QuestionsAvailable[] = [];
    while (questions.length > 0) {
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        if (
          !question.requiredQuestionId ||
          sortedQuestions.some(q => q.id === question.requiredQuestionId)
        ) {
          sortedQuestions.push(question);
          questions.splice(i, 1);
          i--;
        }
      }
    }

    return sortedQuestions;
  }


  submitForm() {
    if (this.form.valid) {
      console.log('Formulario enviado:', this.form.value);
    } else {
      console.log('El formulario contiene errores.');
    }
  }

}
