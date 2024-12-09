import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {StepperHeaderComponent} from '@shared/components/stepper/stepper-header/stepper-header.component';
import {Step} from '@shared/components/stepper/stepper-component/stepper-interfaces';
import {StepperFooterComponent} from '@shared/components/stepper/stepper-footer/stepper-footer.component';
import {AsyncPipe, NgIf, NgTemplateOutlet} from '@angular/common';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-stepper-component',
  standalone: true,
  imports: [
    StepperHeaderComponent,
    StepperFooterComponent,
    NgIf,
    NgTemplateOutlet,
    AsyncPipe
  ],
  templateUrl: './stepper-component.component.html'
})
export class StepperComponentComponent {
  private stepsSubject = new BehaviorSubject<Step[]>([]);
  steps$ = this.stepsSubject.asObservable();
  currentStepIndex = 0;

  @Input() disableNext = false;
  @Input() showFooter = true;
  @Output() completed = new EventEmitter<void>();

  @HostBinding('class') class = 'h-full';

  @Input()
  set steps(steps: Step[]) {
    this.stepsSubject.next(steps);

    const activeStepIndex = steps.findIndex((step) => step.isActive);
    this.currentStepIndex = activeStepIndex >= 0 ? activeStepIndex : 0;
  }

  get steps(): Step[] {
    return this.stepsSubject.getValue();
  }

  next() {
    const steps = this.steps;
    if (this.currentStepIndex < steps.length - 1) {
      steps[this.currentStepIndex].isCompleted = true;
      steps[this.currentStepIndex].isActive = false;

      steps[this.currentStepIndex].onNext?.();

      this.currentStepIndex++;

      steps[this.currentStepIndex].isActive = true;

      this.stepsSubject.next(steps);
    }
  }

  previous() {
    const steps = this.steps;
    if (this.currentStepIndex > 0) {
      steps[this.currentStepIndex].isCompleted = false;
      steps[this.currentStepIndex].isActive = false;

      steps[this.currentStepIndex].onPrevious?.();

      this.currentStepIndex--;

      steps[this.currentStepIndex].isActive = true;
      steps[this.currentStepIndex].isCompleted = false;

      this.stepsSubject.next(steps);
    }
  }

  goToStep(index: number) {
    const steps = this.steps;
    if (steps[this.currentStepIndex].disabled) return;

    this.currentStepIndex = index;

    // Si el onClick retorna false, no se cambia de paso
    if (
      steps[this.currentStepIndex].onClick != undefined &&
      steps[this.currentStepIndex].onClick?.() === false
    ) {
      this.currentStepIndex = steps.findIndex((step) => step.isActive);
      return;
    }

    steps.forEach((step, i) => {
      step.isActive = i === index;
    });

    steps[index].isCompleted = false;

    steps.forEach((step, i) => {
      step.isCompleted = i < index;
    });

    this.stepsSubject.next(steps);
  }

  complete() {
    this.completed.emit();
  }

}
