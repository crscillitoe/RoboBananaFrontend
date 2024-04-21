import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const GSheetReader = require('g-sheets-api');

@Injectable({
  providedIn: 'root'
})
export class InhouseTrackerService {
  sheetId: string = "";
  sheetName: string = "";
  apiKey: string = "";

  constructor() {
    this.sheetId = environment.ranksSheetId;
    this.sheetName = environment.ranksSheetName;
    this.apiKey = environment.ranksSheetAPIKey;
  }

  public getRanksFromSheet() {
    if (this.apiKey == "" || this.sheetId == "" || !this.sheetId.startsWith("10rRyMpAZ")) return;
    const options = {
      apiKey: this.apiKey,
      sheetId: this.sheetId,
      sheetName: this.sheetName
    }

    let sheetData: [] = [];
    const rankInfo: Record<string, string> = {};
    GSheetReader(
      options,
      (res: any) => {
        sheetData = res;
        for (const data of sheetData) {
          const name = (data["riot id"] as string).split("#")[0];
          const rank = data["Current Rank"] ? (data["Current Rank"] as string).replace(" ", "_") : "Unranked";
          rankInfo[name] = rank;
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
    console.log("Ranks loaded from sheet");
    return rankInfo;
  }

}
