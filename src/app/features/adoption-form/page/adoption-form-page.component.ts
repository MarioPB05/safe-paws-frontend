import { Component } from '@angular/core';
import {HlmH1Directive, HlmH2Directive, HlmH3Directive, HlmPDirective} from '@spartan-ng/ui-typography-helm';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {HlmLabelDirective} from '@spartan-ng/ui-label-helm';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';

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
    HlmButtonDirective
  ],
  templateUrl: './adoption-form-page.component.html',
})
export class AdoptionFormPageComponent {

}
