import { Injectable } from '@angular/core';
import { BotConnectorService } from './bot-connector.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private theme: "default" | "christmas" | "custom" = "default";
  private themes = {
    "default": {
      "footer": "assets/footer-woohoojin.png",
      "bottom-left": "assets/left.png",
      "bottom-right": "assets/right.png",
      "ad-background": "assets/ad-block.png",
      "title-text": "#0F0F0F",
      "sub-goal-right-text": "#FFFFFF",
      "sub-goal-right-background": "#000000",
      "sub-goal-left-text": "#000000",
      "sub-goal-left-background": "#FFFFFF",
      "prediction-text": "#000000"
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
