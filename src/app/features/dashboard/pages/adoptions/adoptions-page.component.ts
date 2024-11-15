import { Component } from '@angular/core';
import {AdoptionCardComponent} from '@dashboard/components/adoption-card/adoption-card.component';

@Component({
  selector: 'app-adoptions-page',
  standalone: true,
  imports: [
    AdoptionCardComponent
  ],
  templateUrl: './adoptions-page.component.html'
})
export class AdoptionsPageComponent {

}
