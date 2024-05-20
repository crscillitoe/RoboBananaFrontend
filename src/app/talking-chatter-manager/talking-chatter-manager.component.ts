import { Component, OnInit } from '@angular/core';
import { BotConnectorService } from '../services/bot-connector.service';

@Component({
  selector: 'app-talking-chatter-manager',
  templateUrl: './talking-chatter-manager.component.html',
  styleUrls: ['./talking-chatter-manager.component.scss']
})
export class TalkingChatterManagerComponent implements OnInit {
  constructor(private botService: BotConnectorService) {}

  // Lookup table mapping talkerID to displayName
  talkers: Map<string, string> = new Map<string, string>();

  keys: string[] = [];

  talkerID: string = '';
  displayName: string = '';
  voiceIDs: string[] = ['ryn3WBvkCsp4dPZksMIf', 'rCmVtv8cYU60uhlsOo1M', 'asDeXBMC8hUkhqqL7agO'];

  ngOnInit(): void {
    this.botService.getStream('streamdeck').subscribe(data => {
      if (data.type === 'talker') {
        if (this.talkers.get(data.value) !== undefined) {
          this.talkers.delete(data.value);
          this.updateKeys();
          console.log(this.talkers);
          return;
        }

        if (this.talkers.size >= 3) {
          return;
        }

        this.talkers.set(data.value, data.name);
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
