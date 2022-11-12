import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prediction-render',
  templateUrl: './prediction-render.component.html',
  styleUrls: ['./prediction-render.component.scss']
})
export class PredictionRenderComponent implements OnInit {
  predictionTitle: string = "Will the banana win this game?";

  believeChoiceText: string = "Yes";
  believePayoutMultiplier: string = "1.29";
  believeTotalPoints: string = "2500";

  doubtChoiceText: string = "No";
  doubtPayoutMultiplier: string = "2.4";
  doubtTotalPoints: string = "500";

  believePercentage: number = 60;
  doubtPercentage: number = 40;

  predictionTimer: string = "00:00";

  constructor() { }

  ngOnInit(): void {
  }

}
