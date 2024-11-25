import { Component } from '@angular/core';
import {provideIcons} from '@ng-icons/core';
import {lucideSettings2} from '@ng-icons/lucide';
import {HlmIconComponent} from '@spartan-ng/ui-icon-helm';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    HlmIconComponent
  ],
  templateUrl: './header.component.html',
  providers: [provideIcons({ lucideSettings2 })]
})
export class HeaderComponent {

}
