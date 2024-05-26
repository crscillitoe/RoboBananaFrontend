import { Component, OnInit } from '@angular/core';
import { BotConnectorService } from '../services/bot-connector.service';

interface Talker {
  name: string;
  voiceID: string;
}

@Component({
  selector: 'app-talking-chatter-manager',
  templateUrl: './talking-chatter-manager.component.html',
  styleUrls: ['./talking-chatter-manager.component.scss']
})
export class TalkingChatterManagerComponent implements OnInit {
  constructor(private botService: BotConnectorService) {}

  // Lookup table mapping talkerID to displayName
  talkers: Map<string, Talker> = new Map<string, Talker>();

  keys: string[] = [];

  talkerID: string = '';
  displayName: string = '';

  ngOnInit(): void {
    this.botService.getStream('streamdeck').subscribe(data => {
      if (data.type === 'talker') {
        if (this.talkers.get(data.value) !== undefined) {
          this.talkers.delete(data.value);
          this.updateKeys();
          return;
        }

        if (this.talkers.size >= 3) {
          return;
        }

        this.talkers.set(data.value, {
          name: data.name,
          voiceID: data.voice
        });

        this.updateKeys();

        console.log(this.talkers);
      }

      if (data.type === 'talker-off') {
        this.talkers.clear();
        this.updateKeys();
      }
    });
  }

  updateKeys() {
    const temp = [];
    for (let key of this.talkers.keys()) {
      temp.push(key);
    }

    this.keys = temp;
  }

}
