import {Component, OnInit} from '@angular/core';
import {AdoptionCardComponent} from '@dashboard/components/adoption-card/adoption-card.component';
import {AdoptionService} from '@dashboard/services/adoption.service';
import {AdoptionAvailable} from '@core/models/adoption.model';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-adoptions-page',
  standalone: true,
  imports: [
    AdoptionCardComponent,
    NgForOf
  ],
  templateUrl: './adoptions-page.component.html'
})
export class AdoptionsPageComponent implements OnInit {
  adoptions: AdoptionAvailable[] = [];

  constructor(private adoptionService: AdoptionService) { }

  ngOnInit() {
    this.getAdoptions();
  }

  getAdoptions() {
    this.adoptionService.getAdoptions().subscribe({
      next: (adoptions) => {
        console.log(adoptions);
        this.adoptions = adoptions;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}
