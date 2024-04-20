import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

const GSheetReader = require('g-sheets-api');

@Component({
  selector: 'app-underpeel-draft',
  templateUrl: './underpeel-draft.component.html',
  styleUrls: ['./underpeel-draft.component.scss'],
  animations: []
})
export class UnderpeelDraftComponent implements OnInit {
  apiKey: string = "";
  sheetId: string = "";
  lastPicks: string[] = [];
  lastPickPlayer: string = "";
  currentlyPicking: string = "";

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.apiKey = params["key"];
      this.sheetId = params["sheet"];
    });
  }

  sheetData: any = [];
  tickerData: string = "...Waiting for picks";

  async ngOnInit(): Promise<void> {
    this.setupSheetReader();
  }

  setupSheetReader() {
    if (this.apiKey == "" || this.sheetId == "" || !this.sheetId.startsWith("10rRyMpAZ")) return;
    const options = {
      apiKey: this.apiKey,
      sheetId: this.sheetId,
      sheetName: "vlr pull sheet"
    }

    const interval = setInterval(() => {
      GSheetReader(
        options,
        (res: any) => {
          this.sheetData = res;
          this.updateOverlay();
        },
        (err: any) => {
          console.log(err);
          clearInterval(interval);
          }
      );
    }, 1500);
  }

  updateOverlay() {
    this.tickerData = "";
    if (this.sheetData.length >= 0) {
      if (this.lastPickPlayer != this.sheetData[0]["Player"]) {
        const newPick = `${this.sheetData[0]["Team Name"]} ▶ ${this.sheetData[0]["Player"]}`;
        this.lastPicks.push(newPick);

        this.lastPickPlayer = this.sheetData[0]["Player"];
      }
      this.currentlyPicking = this.sheetData[5]["Player"];
    }
    if (this.lastPicks.length > 3) {
      this.tickerData = this.lastPicks.slice(this.lastPicks.length - 3, this.lastPicks.length).join(" // ");
    } else if (this.lastPicks.length > 0) {
      this.tickerData = this.lastPicks.join(" // ");
    } else {
      this.tickerData = "...Waiting for picks";
    }
  }

}

