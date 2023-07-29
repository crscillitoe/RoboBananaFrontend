import { Component, OnInit } from '@angular/core';
import { BotConnectorService } from '../services/bot-connector.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  QUEUE_LENGTH: number = 25;
  messages: any[] = [];

  constructor(private botService: BotConnectorService) { }

  ngOnInit(): void {
    this.botService.getStream("chat-message").subscribe(data => {
      if (data.content.length > 200) {
        return;
      }

      if (data.content.legnth === 0 && data.stickers.length === 0) {
        return;
      }

      if (data.displayName.length > 12) {
        data.displayName = data.displayName.slice(0, 11);
      }

      if (data.stickers.length > 0) {
        data["stickerURL"] = data.stickers[0].url;
      } else {
        data["stickerURL"] = "";
      }

      data["badgeURL"] = "";
      data["authorColor"] = "rgb(255, 255, 255)"
      data.roles.reverse();
      for (let role of data.roles) {
        if (role.icon != null) {
          data["badgeURL"] = role.icon;
          break;
        }
      }

      for (let role of data.roles) {
        if (role.colorR != 0 || role.colorG != 0 || role.colorB != 0) {
          data["authorColor"] = `rgb(${role.colorR}, ${role.colorG}, ${role.colorB})`;
          break;
        }
      }

      console.log(data);
      this.messages.push(data);
      if (this.messages.length > this.QUEUE_LENGTH) {
        this.messages.shift();
      }
    });
  }


}
