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
  cool: number = 10;

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
    const updateCool = () => {
      if (this.cool > 10) {
        this.cool--;
      }
    }

    setInterval(updateCool, 20000);

    this.botService.getStream("cool").subscribe(data => {
      let cool = data.cool;
      this.cool += cool;

      if (this.cool > 100) {
        this.cool = 100;
      }

      if (this.cool < 0) {
        this.cool = 0;
      }
    });
  }
}
