import {Component, inject, OnInit} from '@angular/core';
import {PredictionSummary} from '../types/predictionSummary';
import {BotConnectorService} from '../services/bot-connector.service';
import {ThemeService} from '../services/theme.service';

@Component({
  selector: 'app-prediction-render',
  templateUrl: './prediction-render.component.html',
  styleUrls: ['./prediction-render.component.scss']
})
export class PredictionRenderComponent implements OnInit {
  predictionTitle: string = "C9 VS SEN - GAME 2";
  acceptingEntries: boolean = true;
  ended: boolean = true;

  believeChoiceText: string = "Yes";
  believePayoutMultiplier: number = 1.29;
  believeTotalPoints: number = 53800320;

  doubtChoiceText: string = "No";
  doubtPayoutMultiplier: number = 2.4;
  doubtTotalPoints: number = 53800320;

  believePercentage: number = 35;
  doubtPercentage: number = 65;

  predictionTimer: string = "00:00";
  endTime: Date = new Date();
  timerInterval: NodeJS.Timer | undefined;

  botService = inject(BotConnectorService);
  themeService = inject(ThemeService);

  ngOnInit(): void {
    this.botService.getStream("predictions").subscribe(data => {
      this.updatePredictionSummary(data as PredictionSummary)
    });
  }

  truncateNumber(num: number): string {
    const thousand = num / 1000;
    const million = num / 1000000;

    if (num < 1000) {
      return '' + num;
    }

    if (thousand < 1000) {
      if (thousand < 100) {
        return thousand.toFixed(1) + 'K';
      }

      return Math.floor(thousand) + 'K';
    }

    if (million < 100) {
      return million.toFixed(1) + 'M';
    }

    return Math.floor(million) + 'M';
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
      minutes = Math.floor(timer / 60);
      seconds = timer % 60;

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      this.predictionTimer = minutes + ":" + seconds;

      if (--timer < 0) {
        timer = 0;
        clearInterval(this.timerInterval);
      }
    }
    updateTimer();
    this.timerInterval = setInterval(updateTimer, 1000);
  }
}
