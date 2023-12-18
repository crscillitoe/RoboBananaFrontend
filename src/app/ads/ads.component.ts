import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss']
})
export class AdsComponent implements OnInit {

  index: number = 0;
  ads: string[] = ["chat", "discord", "goodMorning", "inhouses", "playbooks", "primeSub", "reviews", "subscribe", "thankYou", "vods"];
  ad: string = this.ads[0];

  constructor(public themeService: ThemeService) { }

  ngOnInit(): void {
    const nextAd = () => {
      if (this.index == this.ads.length - 1) {
        this.index = 0;
      }

      this.ad = this.ads[this.index];
      this.index++;
    };

    setInterval(nextAd, 5000);
  }
}
