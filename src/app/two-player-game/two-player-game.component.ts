import { Component, EventEmitter, OnInit } from '@angular/core';
import { BotConnectorService } from '../services/bot-connector.service';

@Component({
  selector: 'app-two-player-game',
  templateUrl: './two-player-game.component.html',
  styleUrls: ['./two-player-game.component.scss']
})
export class TwoPlayerGameComponent implements OnInit {
  moveEmitter: EventEmitter<any> = new EventEmitter<any>();
  resetEmitter: EventEmitter<void> = new EventEmitter<void>();
  playing: boolean = false;
  naScore: number = 0;
  euScore: number = 0;

  constructor(private botService: BotConnectorService) { }

  ngOnInit(): void {
    this.botService.getStream("chess").subscribe(data => {
      console.log(data)
      if (data.open === 1) {
        this.playing = true;
        this.resetEmitter.emit();

        if (data.naScore !== -1) {
          this.naScore = data.naScore;
        }

        if (data.euScore !== -1) {
          this.euScore = data.euScore;
        }
      } else {
        this.playing = false;
        this.resetEmitter.emit();
      }
    });

    this.botService.getStream("chat-message").subscribe(data => {
      this.moveEmitter.emit(data);
    })
  }

  getDisplay() {
    if (this.playing) {
      return "0";
    }

    return "-2000";
  }


  handleGameOver(event: string): void {
    console.log(`GAME OVER HAPPENED LOL: event=${event}`);
  }
}
