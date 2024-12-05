import {Component, HostBinding, Input} from '@angular/core';
import {StepperHeaderComponent} from '@features/adoption-form/components/stepper-header/stepper-header.component';
import {Step} from '@features/adoption-form/components/stepper-component/stepper-interfaces';
import {StepperFooterComponent} from '@features/adoption-form/components/stepper-footer/stepper-footer.component';
import {NgIf, NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'app-stepper-component',
  standalone: true,
  imports: [
    StepperHeaderComponent,
    StepperFooterComponent,
    NgIf,
    NgTemplateOutlet
  ],
  templateUrl: './stepper-component.component.html'
})
export class StepperComponentComponent {
  @Input() steps: Step[] = [];
  @Input() disableNext = false;
  currentStepIndex = 0;

  @HostBinding('class') class = 'h-full';

  next() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.steps[this.currentStepIndex].isCompleted = true;
      this.steps[this.currentStepIndex].isActive = false;

      this.steps[this.currentStepIndex].onNext?.();

      this.currentStepIndex++;

      this.steps[this.currentStepIndex].isActive = true;
    }
  }

  previous() {
    if (this.currentStepIndex > 0) {
        this.steps[this.currentStepIndex].isCompleted = false;
        this.steps[this.currentStepIndex].isActive = false;

        this.steps[this.currentStepIndex].onPrevious?.();

        this.currentStepIndex--;

        this.steps[this.currentStepIndex].isActive = true;
        this.steps[this.currentStepIndex].isCompleted = false;
    }
  }

  goToStep(index: number) {
    this.currentStepIndex = index;

    this.steps[this.currentStepIndex].onClick?.();

    this.steps.forEach((step, i) => {
      step.isActive = i === index;
    });

    this.steps[index].isCompleted = false;

    // Marcar los pasos anteriores como completados
    this.steps.forEach((step, i) => {
      step.isCompleted = i < index;
    });
  }

  complete() {
    console.log('Stepper complete!');
  }

}
