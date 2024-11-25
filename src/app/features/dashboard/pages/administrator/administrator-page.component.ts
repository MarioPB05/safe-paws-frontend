import {Component, computed, effect, signal, TrackByFunction} from '@angular/core'
import {
  HlmTabsComponent,
  HlmTabsContentDirective,
  HlmTabsListComponent,
  HlmTabsTriggerDirective
} from '@spartan-ng/ui-tabs-helm';
import {HlmTableComponent, HlmTableModule, HlmTdComponent, HlmThComponent} from '@spartan-ng/ui-table-helm';
import {FormsModule} from '@angular/forms';
import {BrnTableModule, PaginatorState, useBrnColumnManager} from '@spartan-ng/ui-table-brain';
import {HlmButtonModule} from '@spartan-ng/ui-button-helm';
import {DecimalPipe, TitleCasePipe} from '@angular/common';
import {HlmIconComponent} from '@spartan-ng/ui-icon-helm';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {HlmCheckboxCheckIconComponent, HlmCheckboxComponent} from '@spartan-ng/ui-checkbox-helm';
import {BrnSelectModule} from '@spartan-ng/ui-select-brain';
import {HlmSelectModule} from '@spartan-ng/ui-select-helm';
import {HlmMenuModule} from '@spartan-ng/ui-menu-helm';
import {BrnMenuTriggerDirective} from '@spartan-ng/ui-menu-brain';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {debounceTime, map} from 'rxjs';
import {SelectionModel} from '@angular/cdk/collections';
import {provideIcons} from '@ng-icons/core';
import {lucideArrowUpDown, lucideChevronDown, lucideCircleEllipsis} from '@ng-icons/lucide';

export type Pet = {
  id: string;
  ownerName: string;
  name: string;
  description: string;
};

const PET_DATA: Pet[] = [
  {
    id: 'p1',
    ownerName: 'Juan Pérez',
    name: 'Firulais',
    description: 'Un perro juguetón y amigable.',
  },
  {
    id: 'p2',
    ownerName: 'María López',
    name: 'Pelusa',
    description: 'Gato tímido pero cariñoso.',
  },
  {
    id: 'p3',
    ownerName: 'Carlos García',
    name: 'Max',
    description: 'Pastor alemán entrenado.',
  },
  {
    id: 'p4',
    ownerName: 'Ana Torres',
    name: 'Luna',
    description: 'Conejo pequeño y curioso.',
  },
  {
    id: 'p5',
    ownerName: 'Luis Mendoza',
    name: 'Rocky',
    description: 'Un perro guardián leal.',
  },
];




@Component({
  selector: 'app-administrator',
  standalone: true,
  imports: [
    HlmTabsComponent,
    HlmTabsListComponent,
    HlmTabsTriggerDirective,
    HlmTabsContentDirective,
    HlmTableComponent,
    FormsModule,

    BrnMenuTriggerDirective,
    HlmMenuModule,

    BrnTableModule,
    HlmTableModule,

    HlmButtonModule,

    DecimalPipe,
    TitleCasePipe,
    HlmIconComponent,
    HlmInputDirective,

    HlmCheckboxCheckIconComponent,
    HlmCheckboxComponent,

    BrnSelectModule,
    HlmSelectModule,
    HlmTdComponent,
    HlmThComponent,
  ],
  templateUrl: './administrator-page.component.html',
  providers: [provideIcons({ lucideArrowUpDown, lucideChevronDown, lucideCircleEllipsis })],


})
export class AdministratorPageComponent {
  private readonly _pets = signal(PET_DATA);
  private readonly _filteredPets = computed(() => {
    const nameFilter = this._emailFilter()?.trim()?.toLowerCase();
    if (nameFilter && nameFilter.length > 0) {
      return this._pets().filter((pet) => pet.name.toLowerCase().includes(nameFilter));
    }
    return this._pets();
  });

  protected readonly _filteredSortedPaginatedPets = computed(() => {
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    return this._filteredPets().slice(start, end);
  });

  protected readonly _allDisplayedColumns = computed(() => [
    'select',
    'id',
    'ownerName',
    'name',
    'description',
    'actions',
  ]);

  protected readonly _trackBy: TrackByFunction<Pet> = (_: number, pet: Pet) => pet.id;

  constructor() {
    // Logic for filtering remains unchanged.
    effect(() => this._emailFilter.set(this._debouncedFilter() ?? ''), { allowSignalWrites: true });
  }

  protected togglePet(pet: Pet) {
    this._selectionModel.toggle(pet);
  }

  protected handleHeaderCheckboxChange() {
    const previousCbState = this._checkboxState();
    if (previousCbState === 'indeterminate' || !previousCbState) {
      this._selectionModel.select(...this._filteredSortedPaginatedPets());
    } else {
      this._selectionModel.deselect(...this._filteredSortedPaginatedPets());
    }
  }
}
}
