import { Component } from '@angular/core';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HlmButtonDirective
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent {

}
