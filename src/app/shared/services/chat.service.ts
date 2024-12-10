import { Injectable } from '@angular/core';
import {AuthService} from '@core/services/auth.service';
import {WebSocketSubject} from 'rxjs/internal/observable/dom/WebSocketSubject';
import {Observable} from 'rxjs';
import {webSocket} from 'rxjs/webSocket';

export interface ChatMessage {
  content: string;
  sender: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private subject: WebSocketSubject<ChatMessage> | undefined;

  constructor(private authService: AuthService) {}

  connect(roomCode: string): Observable<ChatMessage> {
    const token = this.authService.getToken();
    const url = `ws://localhost:8080/ws-endpoint?roomCode=${roomCode}&token=${token}`;

    // Crear la conexión WebSocket
    this.subject = webSocket<ChatMessage>(url);

    return this.subject.asObservable();
  }

  sendMessage(message: ChatMessage): void {
    if (this.subject) {
      this.subject.next(message);
    }
  }
}
