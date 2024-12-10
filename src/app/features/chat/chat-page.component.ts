import { Component } from '@angular/core';
import {ChatComponent} from '@shared/components/chat/chat.component';
import {ActivatedRoute} from '@angular/router';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {HlmH2Directive} from '@spartan-ng/ui-typography-helm';
import {StepperComponentComponent} from '@shared/components/stepper/stepper-component/stepper-component.component';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [
    ChatComponent,
    HlmButtonDirective,
    HlmH2Directive,
    StepperComponentComponent
  ],
  templateUrl: './chat-page.component.html',
  styles: ``
})
export class ChatPageComponent {
  roomCode!: string;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.roomCode = params['roomCode'];
    });
  }

}
