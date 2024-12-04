import {Component, Input} from '@angular/core';
import {HlmInputDirective} from "@spartan-ng/ui-input-helm";
import {HlmLabelDirective} from "@spartan-ng/ui-label-helm";
import {AdoptionAvailable} from '@core/models/adoption.model';
import {QuestionsAvailable} from '@core/models/question.model';
import {NgIf} from '@angular/common';
import {HlmSwitchComponent} from '@spartan-ng/ui-switch-helm';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [
    HlmInputDirective,
    HlmLabelDirective,
    NgIf,
    HlmSwitchComponent,
    HlmSwitchComponent,
    FormsModule,
    HlmSwitchComponent,
    ReactiveFormsModule
  ],
  templateUrl: './question.component.html'
})
export class QuestionComponent {
  @Input() question!: QuestionsAvailable;
}
