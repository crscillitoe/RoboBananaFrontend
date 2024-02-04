import { Component, OnInit, ViewChild } from '@angular/core';
import { CoolIconComponent } from '../cool-icon/cool-icon.component';
import { CoolIconDirective } from './cool-icon-directive';
import { timer } from "rxjs";
import { getBaseStreamURL } from '../utility';
import { BotConnectorService } from '../services/bot-connector.service';

@Component({
  selector: 'app-cool',
  templateUrl: './cool.component.html',
  styleUrls: ['./cool.component.scss']
})
export class CoolComponent implements OnInit {
  cool: number = 50;
  thresholds: number = 100;

  type: string = "sheesh";

  barTypes: any = {
    "sheesh": {
      cool: {
        tokens: ["hoojSheesh", "<:hoojSheesh:1076744568818647103>", "SHEESH"],
        color: "#FFC700",
        image: "assets/hoojsheesh.png"
      },
      uncool: {
        tokens: ["hoojStare", "<:hoojStare:1087887812923232266>"],
        color: "#262626"
      },
      swap: false
    },
    "joel": {
      cool: {
        tokens: ["Joel", "<a:Joel:1170523859087269968>"],
        color: "#FFC700",
        image: "assets/Joel.webp"
      },
      uncool: {
        tokens: ["Hose", "<a:Hose:1170505369043353610>"],
        color: "#24AFFE",
        image: "assets/Hose.webp"
      },
      swap: true
    }
  }

  @ViewChild(CoolIconDirective, { static: true }) coolIconHost!: CoolIconDirective;

  calculateWidth() {
    if (this.cool > 100) {
      return 100;
    }

    return this.cool;
  }

  calculateRemainder() {
    return 100 - this.calculateWidth();
  }

  getBarType() {
    return this.barTypes[this.type];
  }

  constructor(private botService: BotConnectorService) { }

  ngOnInit(): void {
    this.botService.getStream("streamdeck").subscribe(data => {
      if (data.type === "meter") {
        this.type = data.value;
      }

      if (data.type === "tvt") {
        if (!data.enabled) {
          this.type = "sheesh";
          return;
        }

        this.barTypes["tvt"] = {
          cool: {
            tokens: data.team1tokens,
            color: data.team1barColor,
            image: data.team1logo
          },
          uncool: {
            tokens: data.team2tokens,
            color: data.team2barColor,
            image: data.team2logo
          },
          swap: true
        }

        console.log(this.barTypes);

        this.type = "tvt";
      }
    });

    this.botService.getStream("chat-message").subscribe(data => {
      if (data.content.length > 200) return;
      const message: string = data.content;

      const tokens = message.toUpperCase().split(" ");
      const coolTokens: string[] = (this.barTypes[this.type] as any).cool.tokens;
      const uncoolTokens: string[] = (this.barTypes[this.type] as any).uncool.tokens;

      for (const token of tokens) {
        if (coolTokens.includes(token)) {
          this.cool++;
          break;
        }

        if (uncoolTokens.includes(token)) {
          this.cool--;
          break;
        }
      }
    });
  }
}
