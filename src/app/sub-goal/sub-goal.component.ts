import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sub-goal',
  templateUrl: './sub-goal.component.html',
  styleUrls: ['./sub-goal.component.scss']
})
export class SubGoalComponent implements OnInit {
  tier1: number = 0;
  tier2: number = 0;
  tier3: number = 0;

  total: number = 50;

  goal: number = 1500;

  constructor() { }

  getPercentage() {
    return (this.total / this.goal) * 100;
  }

  ngOnInit(): void {
    let streamURL = decodeURIComponent(window.location.search);
    streamURL = streamURL.slice(1, streamURL.length - 1);
    streamURL += "?channel=subs-count"
    var source = new EventSource(streamURL);
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
  }

}
