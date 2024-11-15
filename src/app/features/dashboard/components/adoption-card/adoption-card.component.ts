import { Component } from '@angular/core';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {HlmBadgeDirective} from '../../../../../libs/ui/ui-badge-helm/src';
import {HlmH3Directive, HlmPDirective} from '@spartan-ng/ui-typography-helm';
import {HlmIconComponent} from '@spartan-ng/ui-icon-helm';
import {provideIcons} from '@ng-icons/core';
import {lucideMapPin} from '@ng-icons/lucide';

@Component({
  selector: 'app-adoption-card',
  standalone: true,
  imports: [
    HlmButtonDirective,
    HlmBadgeDirective,
    HlmH3Directive,
    HlmPDirective,
    HlmIconComponent
  ],
  templateUrl: './adoption-card.component.html',
  providers: [provideIcons({ lucideMapPin })]
})
export class AdoptionCardComponent {

}
