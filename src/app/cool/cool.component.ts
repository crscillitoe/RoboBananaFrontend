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

  constructor(private botService: BotConnectorService) { }

  ngOnInit(): void {
    this.botService.getStream("chat-message").subscribe(data => {
      if (data.content.length > 200) return;

      const tokens = data.content.split(" ");
      for (const token of tokens) {
        if (token === "Joel") {
          this.cool++;
          break;
        }

        if (token === "Hose") {
          this.cool--;
          break;
        }
      }
    });
  }
}
