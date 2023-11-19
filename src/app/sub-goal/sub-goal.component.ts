import { Component, OnInit } from '@angular/core';
import { getBaseStreamURL } from '../utility';
import { Howl } from 'howler';
import { animate, style, transition, trigger } from '@angular/animations';
import { BotConnectorService } from '../services/bot-connector.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-sub-goal',
  templateUrl: './sub-goal.component.html',
  styleUrls: ['./sub-goal.component.scss'],
  animations: [
    trigger('slideUp', [
      transition(':enter', [
          style({'padding-top': '154px'}),
          animate('1s ease-out', style({'padding-top': '0px'}))
      ]),

      transition(':leave',
        animate('1s ease-out', style({'padding-top': '154px'}))
      )
    ])
  ]
})
export class SubGoalComponent implements OnInit {
  tier1: number = 0;
  tier2: number = 0;
  tier3: number = 0;

  total: number = 1000;
  goal: number = 2000;

  displaySub: boolean = false;
  subMessage: string = "THANK YOU WOOHOOJIN FOR THE T3 I REALLY APPRECIATE IT DUDE GOOD LOOKS NICE JOB YOU'RE A KING";
  subHowl: Howl;
  lastTimeout: NodeJS.Timeout | undefined;

  constructor(private botService: BotConnectorService, public themeService: ThemeService) {
    this.subHowl = new Howl({
      src: ["assets/ChossBoss.wav"],
      autoplay: false,
      loop: false
    });
  }

  getPercentage() {
    return (this.total / this.goal) * 100;
  }

  ngOnInit(): void {
    this.botService.getStream("subs").subscribe(data => {
      if (this.lastTimeout) {
        clearTimeout(this.lastTimeout);
      }

      this.subMessage = data.message;
      let timeout = 5000;

      this.displaySub = true;
      this.subHowl.stop();
      this.subHowl.play();
      this.subHowl.fade(0.6, 0, timeout)


      this.lastTimeout = setTimeout(() => {
        this.displaySub = false;
      }, timeout);
    });

    this.botService.getStream("subs-count").subscribe(data => {
      this.tier1 = data.tier1Count;
      this.tier2 = data.tier2Count;
      this.tier3 = data.tier3Count;

      this.total = this.tier1 + this.tier2 + this.tier3;
    });
  }
}
