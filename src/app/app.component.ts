import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {LoadingComponent} from '@shared/components/loading/loading.component';
import {HlmToasterComponent} from '@spartan-ng/ui-sonner-helm';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingComponent, HlmToasterComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {

}
