import { Component } from '@angular/core';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {HlmH2Directive} from '@spartan-ng/ui-typography-helm';
import {toast} from 'ngx-sonner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HlmButtonDirective,
    HlmH2Directive
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  suscribeNewsLetter() {
    toast.success('Te has suscrito correctamente');
  }
}
