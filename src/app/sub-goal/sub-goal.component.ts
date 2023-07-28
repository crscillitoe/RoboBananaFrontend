import { Component, OnInit } from '@angular/core';
import { getBaseStreamURL } from '../utility';
import { Howl } from 'howler';
import { animate, style, transition, trigger } from '@angular/animations';

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
  goal: number = 1500;

  displaySub: boolean = false;
  subMessage: string = "THANK YOU WOOHOOJIN FOR THE T3 I REALLY APPRECIATE IT DUDE GOOD LOOKS NICE JOB YOU'RE A KING";
  subHowl: Howl;
  lastTimeout: NodeJS.Timeout | undefined;

  constructor() {
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
    const streamURL = getBaseStreamURL() + "?channel=subs-count"
    const subNotifStreamURL = getBaseStreamURL() + "?channel=subs"
    var source = new EventSource(streamURL);
    var subSource = new EventSource(subNotifStreamURL);

    source.addEventListener('open', (e) => {
      console.log("The connection has been established.");
    });
    source.addEventListener('publish', (event) => {
      var data = JSON.parse(event.data);
      console.log(data);

      this.tier1 = data.tier1Count;
      this.tier2 = data.tier2Count;
      this.tier3 = data.tier3Count;

      this.total = this.tier1 + this.tier2 + this.tier3;
    }, false);
    source.addEventListener('error', function (event) {
      console.log(event)
    }, false);


    subSource.addEventListener('open', (e) => {
      console.log("The connection has been established.");

      if (this.lastTimeout) {
        clearTimeout(this.lastTimeout);
      }
    });

    subSource.addEventListener('publish', (event) => {
      if (this.lastTimeout) {
        clearTimeout(this.lastTimeout);
      }

      var data = JSON.parse(event.data);
      this.subMessage = data.message;
      let timeout = 5000;

      this.total++;

      this.displaySub = true;
      this.subHowl.stop();
      this.subHowl.play();
      this.subHowl.fade(0.6, 0, timeout)


      this.lastTimeout = setTimeout(() => {
        this.displaySub = false;
      }, timeout);
    }, false);

    subSource.addEventListener('error', function (event) {
      console.log(event)
    }, false);
  }

}
