import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from '@angular/common';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-stepper-footer',
  standalone: true,
  imports: [
    NgIf,
    HlmButtonDirective
  ],
  templateUrl: './stepper-footer.component.html',
  styles: ``
})
export class StepperFooterComponent {
  @Input() currentStepIndex!: number;
  @Input() isLastStep!: boolean;
  @Input() disableNext = false;
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() complete = new EventEmitter<void>();
}
