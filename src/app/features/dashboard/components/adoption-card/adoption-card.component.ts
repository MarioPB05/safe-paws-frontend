import {Component, HostBinding, Input, ViewChild} from '@angular/core';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {HlmBadgeDirective} from '../../../../../libs/ui/ui-badge-helm/src';
import {HlmH3Directive, HlmPDirective} from '@spartan-ng/ui-typography-helm';
import {HlmIconComponent} from '@spartan-ng/ui-icon-helm';
import {provideIcons} from '@ng-icons/core';
import {lucideMapPin} from '@ng-icons/lucide';
import {AdoptionAvailable} from '@core/models/adoption.model';
import {DetailsCardComponent} from '@dashboard/components/details-card/details-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adoption-card',
  standalone: true,
  imports: [
    HlmButtonDirective,
    HlmBadgeDirective,
    HlmH3Directive,
    HlmPDirective,
    HlmIconComponent,
    DetailsCardComponent
  ],
  templateUrl: './adoption-card.component.html',
  providers: [provideIcons({ lucideMapPin })]
})
export class AdoptionCardComponent {
  @HostBinding('class') hostClass = 'min-h-[300px] min-w-[280px] mt-20';
  @Input() adoption!: AdoptionAvailable;
  @ViewChild(DetailsCardComponent) detailsCard!: DetailsCardComponent;

  constructor(private router: Router) {}

  openDetails(): void {
    this.detailsCard.showPostDetails(this.adoption.id);
  }

  redirectToAdoptionForm($event: MouseEvent): void {
    $event.stopPropagation();

    this.router.navigate([`/adoption/${this.adoption.id}/form`]);
  }

  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length <= maxLength ? text : text.substring(0, maxLength - 3) + '...';
  }
}
