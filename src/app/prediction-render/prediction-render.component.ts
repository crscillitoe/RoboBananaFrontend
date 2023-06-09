import { Component, OnInit } from '@angular/core';
import { PredictionSummary } from '../types/predictionSummary';

@Component({
  selector: 'app-prediction-render',
  templateUrl: './prediction-render.component.html',
  styleUrls: ['./prediction-render.component.scss']
})
export class PredictionRenderComponent implements OnInit {
  predictionTitle: string = "IS THIS GAME A DUB?";
  acceptingEntries: boolean = true;
  ended: boolean = true;

  believeChoiceText: string = "Yes";
  believePayoutMultiplier: number = 1.29;
  believeTotalPoints: number = 2500;

  doubtChoiceText: string = "No";
  doubtPayoutMultiplier: number = 2.4;
  doubtTotalPoints: number = 500;

  believePercentage: number = 0;
  doubtPercentage: number = 100;

  predictionTimer: string = "00:00";
  endTime: Date = new Date();
  timerInterval: NodeJS.Timer | undefined;

  constructor() { }

  ngOnInit(): void {
    let streamURL = decodeURIComponent(window.location.search);
    streamURL = streamURL.slice(1, streamURL.length - 1);
    streamURL += "?channel=predictions"
    var source = new EventSource(streamURL);
    source.addEventListener('open', (e) => {
      console.log("The connection has been established.");
    });
    source.addEventListener('publish', (event) => {
      var data = JSON.parse(event.data);
      console.log(data);
      this.updatePredictionSummary(data as PredictionSummary)
    }, false);
    source.addEventListener('error', function (event) {
      console.log(event)
    }, false);
  }

  private updatePredictionSummary(summary: PredictionSummary): void {
    this.predictionTitle = summary.description;
    this.believeChoiceText = summary.optionOne;
    this.doubtChoiceText = summary.optionTwo;
    this.believeTotalPoints = summary.optionOnePoints;
    this.doubtTotalPoints = summary.optionTwoPoints;
    this.acceptingEntries = summary.acceptingEntries;
    this.updateCalculatedFields(summary);
    this.startTimer(new Date(summary.endTime), summary.acceptingEntries)
    this.ended = summary.ended;
  }

  private updateCalculatedFields(summary: PredictionSummary): void {
    const totalPoints = summary.optionOnePoints + summary.optionTwoPoints;
    if (totalPoints === 0) {
      this.believePercentage = 50;
      this.doubtPercentage = 50;
      this.believePayoutMultiplier = 1;
      this.doubtPayoutMultiplier = 1;
      return;
    }
    this.believePercentage = Math.round((summary.optionOnePoints / totalPoints) * 100);
    this.doubtPercentage = 100 - this.believePercentage;
    this.believePayoutMultiplier = this.calculateMultiplier(summary.optionOnePoints, summary.optionTwoPoints);
    this.doubtPayoutMultiplier = this.calculateMultiplier(summary.optionTwoPoints, summary.optionOnePoints);
  }

  private calculateMultiplier(optionOne: number, optionTwo: number): number {
    if (optionOne === 0) return 1;
    const multiplier = 1 + (optionTwo / optionOne)
    return Math.round((multiplier + Number.EPSILON) * 100) / 100
  }

  public getTimerColor() {
    if (this.predictionTimer === "CLOSED") {
      return "red";
    }

    return "#1E1E1E";
  }

  isClosed() {
    return !this.acceptingEntries;
  }

  private startTimer(endTime: Date, acceptingEntries: boolean) {
    if (!acceptingEntries) {
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.predictionTimer = "CLOSED";
      return;
    }

    if (endTime === this.endTime) return;
    this.endTime = endTime

    if (this.timerInterval) clearInterval(this.timerInterval);
    const now = new Date();


    let timer = Math.round((this.endTime.getTime() - now.getTime()) / 1000);

    let minutes;
    let seconds;
    const updateTimer = () => {
      if (timer >= 0) {
        minutes = Math.floor(timer / 60);
        seconds = timer % 60;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        this.predictionTimer = minutes + ":" + seconds;
      }

      if (--timer < 0) {
        timer = -1;
        this.predictionTimer = "00:00";
        clearInterval(this.timerInterval);
      }
    }
    updateTimer();
    this.timerInterval = setInterval(updateTimer, 1000);
  }
}
