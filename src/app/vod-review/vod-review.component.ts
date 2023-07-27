import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getBaseStreamURL } from '../utility';
import { state, trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-vod-review',
  templateUrl: './vod-review.component.html',
  styleUrls: ['./vod-review.component.scss'],
  animations: [
    trigger('slideUp', [
      transition(':enter', [
          style({'padding-top': '100px'}),
          animate('1s ease-out', style({'padding-top': '0px'}))
      ]),

      transition(':leave',
        animate('1s ease-out', style({'padding-top': '100px'}))
      )
    ])
  ]
})
export class VodReviewComponent implements OnInit {
  colors: any = {
    "Radiant": "#FFFBD3",
    "Immortal": "#CD3C50",
    "Ascendant": "#51CB8A",
    "Diamond": "#C688F7",
    "Platinum": "#58B8C6",
    "Gold": "#FFD359",
    "Silver": "#D6D5D6",
    "Bronze": "#D3A974",
    "Iron": "#BDBEBD",
    "none": "#FFE400"
  };

  riotid: string = "WOOHOOJIN#COACH";
  username: string = "WOOHOOJIN";
  rank: string = "Diamond_3_Rank.png";
  background: string = "Diamond.png"
  complete: boolean = true;
  nameColor: string = this.colors["Diamond"];

  constructor(private client: HttpClient) { }

  ngOnInit(): void {
    const streamURL = getBaseStreamURL() + "?channel=vod-reviews"
    var source = new EventSource(streamURL);
    source.addEventListener('open', (e) => {
      console.log("The connection has been established.");
    });
    source.addEventListener('publish', (event) => {
      var data = JSON.parse(event.data);
      console.log(data);

      this.rank = data.rank + "_Rank.png";
      let rankName = data.rank.replace(/[\d_]+/g, '');
      this.background = rankName + ".png";
      this.nameColor = this.colors[rankName];
      this.riotid = data.riotid;
      this.username = data.username;
      this.complete = data.complete;
    }, false);
    source.addEventListener('error', function (event) {
      console.log(event)
    }, false);
  }

}
