import { Component, Input } from '@angular/core';
import { ChatChunkType } from '../services/chat-processor.service';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent {
  @Input()
  message!: any;

  public get ChatChunkType() {
    return ChatChunkType;
  }
}
