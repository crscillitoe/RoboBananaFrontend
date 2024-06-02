import { Component, OnInit } from '@angular/core';
import { BotConnectorService } from '../services/bot-connector.service';

interface Talker {
  name: string;
  voiceID: string;
}

interface Player {
  UserID: string;
  VoiceID: string;
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

  pendingNonMages: Player[] = [];
  pendingMages: Player[] = [];

  ngOnInit(): void {
    this.botService.getStream('streamdeck').subscribe(data => {
      if (data.type === 'dnd') {
        const player: Player = {
          UserID: data.user_id,
          VoiceID: data.voice_id
        };

        if (data.can_mage) {
          this.pendingMages.push(player);
        } else {
          this.pendingNonMages.push(player);
        }
      }

      if (data.type === 'dnd-raffle') {
        this.talkers.clear();

        const characters: {name: string, mage: boolean}[] = data.characters;
        for (let character of characters) {
          let player: Player;
          if (character.mage) {
            // Select random mage from pendingMages
            const index = Math.floor(Math.random() * this.pendingMages.length);
            player = this.pendingMages[index];

            this.pendingMages.splice(index, 1);
          } else {
            const index = Math.floor(Math.random() * this.pendingNonMages.length);
            player = this.pendingNonMages[index];

            this.pendingNonMages.splice(index, 1);
          }

          const talker: Talker = {
            name: character.name,
            voiceID: player.VoiceID
          }

          this.talkers.set(player.UserID, talker);

          console.log(this.talkers);
        }

        this.updateKeys();

        this.pendingMages = [];
        this.pendingNonMages = [];
      }

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
