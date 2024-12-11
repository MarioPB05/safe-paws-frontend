import { Component } from '@angular/core';
import {HlmTooltipComponent, HlmTooltipTriggerDirective} from '@spartan-ng/ui-tooltip-helm';
import {BrnTooltipContentDirective} from '@spartan-ng/ui-tooltip-brain';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    HlmTooltipComponent,
    HlmTooltipTriggerDirective,
    BrnTooltipContentDirective,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {

}
