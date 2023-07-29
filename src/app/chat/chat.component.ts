import { Component, OnInit } from '@angular/core';
import { BotConnectorService } from '../services/bot-connector.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor(private botService: BotConnectorService) { }

  ngOnInit(): void {
    this.botService.getStream("chat-message").subscribe(data => {
      console.log(data);
    });
  }

}
