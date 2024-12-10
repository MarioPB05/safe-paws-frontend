import {Component, HostBinding, Input, OnDestroy, OnInit} from '@angular/core';
import {ChatMessage, ChatService} from '@shared/services/chat.service';
import {Subscription} from 'rxjs';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {
  HlmAlertDescriptionDirective,
  HlmAlertDirective,
  HlmAlertIconDirective,
  HlmAlertTitleDirective
} from '@spartan-ng/ui-alert-helm';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {FormsModule} from '@angular/forms';
import {HlmScrollAreaComponent} from '@spartan-ng/ui-scrollarea-helm';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    HlmAlertTitleDirective,
    HlmAlertDescriptionDirective,
    HlmAlertIconDirective,
    HlmAlertDirective,
    HlmInputDirective,
    HlmButtonDirective,
    FormsModule,
    HlmScrollAreaComponent
  ],
  templateUrl: './chat.component.html',
  styles: ``
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() roomCode!: string;
  @Input() sender!: string;

  @HostBinding('class') class = 'relative w-full flex-1 flex flex-col mt-6 rounded-2xl bg-primary-100 shadow-lg min-h-[600px]';

  messages: ChatMessage[] = [];
  newMessage: string = '';
  chatClosed: boolean = false;
  sendCooldown: boolean = false;
  private messageSubscription: Subscription | undefined;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.messageSubscription = this.chatService.connect(this.roomCode).subscribe({
      next: (message: ChatMessage) => {
        if (message.sender === 'server-status') {
          if (message.content === 'successfully-sent') {
            this.sendCooldown = false;
          }

          return;
        }

        this.messages.push(message);
      },
      error: (err) => {
        console.error(err);
        this.chatClosed = true;
      },
      complete: () => {
        this.chatClosed = true;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.sendCooldown = true;
      const message: ChatMessage = {content: this.newMessage, sender: this.sender };
      this.chatService.sendMessage(message);
      this.newMessage = '';
      // setTimeout(() => this.sendCooldown = false, 800);
    }
  }
}
