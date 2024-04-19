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

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.apiKey = params["key"];
      this.sheetId = params["sheet"];
    });
  }

  sheetData: [] = [];
  tickerData: string = "";

  async ngOnInit(): Promise<void> {
    this.setupSheetReader();
  }

  setupSheetReader() {
    if (this.apiKey == "" || this.sheetId == "" || !this.sheetId.startsWith("1z5mR1tecFqHgS")) return;
    const options = {
      apiKey: this.apiKey,
      sheetId: this.sheetId,
      sheetName: "Dunkel Test (Ignore)"
    }

    setInterval(() => {
      GSheetReader(
        options,
        (res: any) => {
          this.sheetData = res;
          this.updateOverlay();
        },
        (err: any) => {
          console.log(err);
        }
      );
    }, 1500);
  }

  updateOverlay() {
    this.tickerData = "";
    let idx = this.sheetData.length - 3;
    for (let curr = 0; idx < this.sheetData.length; idx++, curr++) {
      const element = this.sheetData[idx];
      if (curr != 2) {
        this.tickerData += `${element["Team Name"]} picks ${element["Player"]} - `;
      } else {
        
      this.tickerData += `${element["Team Name"]} picks ${element["Player"]}`;
      }
    }
  }

}

