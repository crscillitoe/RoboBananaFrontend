import { Component, OnInit } from '@angular/core';

import { Howl, Howler } from 'howler';
import { getBaseStreamURL } from '../utility';
import { BotConnectorService } from '../services/bot-connector.service';

@Component({
  selector: 'app-sub-render',
  templateUrl: './sub-render.component.html',
  styleUrls: ['./sub-render.component.scss']
})
export class SubRenderComponent implements OnInit {

  displaySub: boolean = false;
  subMessage: string = "THANK YOU WOOHOOJIN FOR THE T3 I REALLY APPRECIATE IT DUDE GOOD LOOKS NICE JOB YOU'RE A KING";
  subHowl: Howl;

  lastTimeout: NodeJS.Timeout | undefined;

  constructor(private botService: BotConnectorService) {
    this.subHowl = new Howl({
      src: ["assets/ChossBoss.wav"],
      autoplay: false,
      loop: false
    });
  }

  ngOnInit(): void {
    this.botService.getStream("subs").subscribe(data => {
      console.log(data);
    });

    const streamURL = getBaseStreamURL() + "?channel=subs"
    let source = new EventSource(streamURL);

    source.addEventListener('open', (e) => {
      console.log("The connection has been established.");

      if (this.lastTimeout) {
        clearTimeout(this.lastTimeout);
      }

      this.displaySub = true;
      this.subHowl.stop();
      this.subHowl.play();
      this.subHowl.fade(0.6, 0, 30000)

      this.lastTimeout = setTimeout(() => {
        this.displaySub = false;
      }, 5000);
    });

    source.addEventListener('publish', (event) => {
      if (this.lastTimeout) {
        clearTimeout(this.lastTimeout);
      }

      var data = JSON.parse(event.data);
      this.subMessage = data.message;
      let timeout = 5000;
      let role = data.tier;
      if (role === "THE ONES WHO KNOW (Discord Sub Tier 3)") {
        timeout = 10000;
      } else if (role === "SUPER KNOWER (Discord Sub Tier 2)") {
        timeout = 10000;
      }

      this.displaySub = true;
      this.subHowl.stop();
      this.subHowl.play();
      this.subHowl.fade(0.6, 0, timeout)


      this.lastTimeout = setTimeout(() => {
        this.displaySub = false;
      }, timeout);
    }, false);

    source.addEventListener('error', function (event) {
      console.log(event)
    }, false);
  }

}
