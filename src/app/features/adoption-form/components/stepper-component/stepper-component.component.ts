import {Component, Input} from '@angular/core';
import {StepperHeaderComponent} from '@features/adoption-form/components/stepper-header/stepper-header.component';
import {Step} from '@features/adoption-form/components/stepper-component/stepper-interfaces';

@Component({
  selector: 'app-stepper-component',
  standalone: true,
  imports: [
    StepperHeaderComponent
  ],
  templateUrl: './stepper-component.component.html'
})
export class StepperComponentComponent {
  @Input() steps: Step[] = [];
  currentStepIndex = 0;

  next() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.steps[this.currentStepIndex].isCompleted = true;
      this.currentStepIndex++;
    }
  }

  previous() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
    }
  }

  goToStep(index: number) {
    this.currentStepIndex = index;
  }

  complete() {
    console.log('Stepper complete!');
  }

}
