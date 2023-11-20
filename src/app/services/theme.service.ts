import { Injectable } from '@angular/core';
import { BotConnectorService } from './bot-connector.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private theme = "default";
  private themes = {
    "default": {
      "footer": "assets/footer-woohoojin.png",
      "bottom-left": "assets/left.png",
      "bottom-right": "assets/right.png"
    },
    "christmas": {
      "footer": "assets/themes/christmas/footer.mp4",
      "bottom-left": "assets/themes/christmas/left.png",
      "bottom-right": "assets/themes/christmas/right.png"
    }
  }

  constructor(private botConnector: BotConnectorService) {
    botConnector.getStream("streamdeck").subscribe(data => {
      if (data.type === "theme") {
        this.setTheme(data.value);
      }
    });
  }

  setTheme(theme: "default" | "christmas") {
    this.theme = theme;
  }

  getRightImage() {
    return ((this.themes as any)[this.theme]) ["bottom-right"];
  }

  getLeftImage() {
    return ((this.themes as any)[this.theme]) ["bottom-left"];
  }

  getMiddleImage() {
    return ((this.themes as any)[this.theme]) ["footer"];
  }
}
