import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SystemMessageService {

  MessageStream: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor() { }

  sendMessage(content: string) {
      let message = {
        "content": content,
        "displayName": "SYSTEM",
        "authorColor": "rgb(255, 228, 0)",
        "roles": [{"colorR": 255, "colorG": 255, "colorB": 255, "icon": null, "id": 1, "name": "@SYSTEM"}],
        "stickers": [],
        "emojis": [],
        "mentions": [],
        "author_id": 1,
        "platform": "discord"
      };

      this.MessageStream.next(message);
  }

  getSystemMessageStream() {
    return this.MessageStream;
  }
}
