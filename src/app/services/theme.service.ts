import { Injectable } from '@angular/core';
import { BotConnectorService } from './bot-connector.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private theme: "default" | "christmas" | "custom" = "default";
  private themes = {
    "default": {
      "bottom-right": "https://i.imgur.com/syvozOL.png",
      "title-text": "#FFD359",
      "sub-goal-left-background": "#FFFFFF",
      "sub-goal-left-text": "#000000",
      "sub-goal-right-background": "#FDD359",
      "sub-goal-right-text": "#000000",

      "footer": "https://i.imgur.com/ESITlik.png",

      "bottom-left": "https://i.imgur.com/wFMwmDY.png",
      "prediction-text": "#FFFFFF",

      "ad-background": "https://i.imgur.com/cYRiggp.png"
    },
    "christmas": {
      "footer": "assets/themes/christmas/footer.mp4",
      "bottom-left": "assets/themes/christmas/left.png",
      "bottom-right": "assets/themes/christmas/right.png",
      "ad-background": "assets/themes/christmas/ad-container.png",
    },
    "custom": {
    }
  }

  constructor(private botConnector: BotConnectorService) {
    botConnector.getStream("streamdeck").subscribe(data => {
      if (data.type === "theme") {
        if (data.value !== "default") {
          this.fillMissingValues(this.themes["christmas"], this.themes["default"])
        }

        this.setTheme(data.value);
      } else if (data.type === "theme_custom") {
        (this.themes as any)["custom"] = this.fillMissingValues(data.value, this.themes[this.getTheme()]);
        this.setTheme("custom")
      }
    });
  }

  fillMissingValues(providedData: any, defaultData: any) {
    for (let key in defaultData) {
      if (providedData[key] === undefined) {
        providedData[key] = defaultData[key];
      }
    }

    return providedData;
  }

  setTheme(theme: "default" | "christmas" | "custom") {
    this.theme = theme;
  }

  getTheme(): "default" | "christmas" | "custom" {
    return this.theme;
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

  getLessDark() {
    return ((this.themes as any)[this.theme]) ["title-text"];
  }

  getSubGoalRightText() {
    return ((this.themes as any)[this.theme]) ["sub-goal-right-text"];
  }

  getSubGoalRightBackground() {
    return ((this.themes as any)[this.theme]) ["sub-goal-right-background"];
  }

  getSubGoalLeftText() {
    return ((this.themes as any)[this.theme]) ["sub-goal-left-text"];
  }

  getSubGoalLeftBackground() {
    return ((this.themes as any)[this.theme]) ["sub-goal-left-background"];
  }

  getPredictionText() {
    return ((this.themes as any)[this.theme]) ["prediction-text"];
  }

  getAdBackground() {
    return ((this.themes as any)[this.theme]) ["ad-background"];
  }
}
