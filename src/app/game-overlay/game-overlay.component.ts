import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { BotConnectorService } from '../services/bot-connector.service';

@Component({
  selector: 'app-game-overlay',
  templateUrl: './game-overlay.component.html',
  styleUrls: ['./game-overlay.component.scss']
})
export class GameOverlayComponent implements OnInit {

  display: boolean = false;
  gameName: string = "";

  constructor(private botService: BotConnectorService) {}

  ngOnInit(): void {
    this.botService.getStream("streamdeck").subscribe(data => {
      if (data.type === "gameOverlay") {
        this.display = data.overlayState === 1;
        this.gameName = data.gameName;
      }
    });
  }
}
