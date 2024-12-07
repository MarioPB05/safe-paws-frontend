import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Step} from '@shared/components/stepper/stepper-component/stepper-interfaces';
import {NgClass, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-stepper-header',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './stepper-header.component.html'
})
export class StepperHeaderComponent {
  @Input() steps: Step[] = [];
  @Input() currentStepIndex!: number;
  @Output() selectStep = new EventEmitter<number>();
}
