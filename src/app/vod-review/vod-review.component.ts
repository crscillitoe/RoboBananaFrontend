import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getBaseStreamURL } from '../utility';

@Component({
  selector: 'app-vod-review',
  templateUrl: './vod-review.component.html',
  styleUrls: ['./vod-review.component.scss']
})
export class VodReviewComponent implements OnInit {
  riotid: string = "";
  username: string = "";
  rank: string = "";
  complete: boolean = true;

  constructor(private client: HttpClient) { }

  scrapeTracker(username: string): void {
    const split = username.split("#");
    const targetURL = `https://tracker.gg/valorant/profile/riot/${split[0]}%23${split[1]}/overview`;
    console.log(targetURL);
  }

  ngOnInit(): void {
    this.client.get("https://tracker.woohooj.in/valorant/profile/riot/Woohoojin%23COACH/overview").subscribe(data => {
      console.log(data);
    });

    const streamURL = getBaseStreamURL() + "?channel=vod-reviews"
    var source = new EventSource(streamURL);
    source.addEventListener('open', (e) => {
      console.log("The connection has been established.");
    });
    source.addEventListener('publish', (event) => {
      var data = JSON.parse(event.data);
      console.log(data);

      this.scrapeTracker(data.username);
      this.rank = data.rank + "_Rank.png";
      this.riotid = data.riotid;
      this.username = data.username;
      this.complete = data.complete;
    }, false);
    source.addEventListener('error', function (event) {
      console.log(event)
    }, false);
  }

}
