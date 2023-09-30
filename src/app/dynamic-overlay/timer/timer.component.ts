import { Component, OnInit } from '@angular/core';
import { BotConnectorService } from 'src/app/services/bot-connector.service';
import { FieldAdapter } from '../field-adapter';
import { HideableComponent } from '../hideable/hideable.component';
import { animate, style, transition, trigger } from '@angular/animations';

type TimerDirection = "inc" | "dec";

@Component({
  selector: 'dynamic-overlay-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent extends HideableComponent implements OnInit {
  duration?: number;
  formattedTimer: string = "";
  interval: NodeJS.Timer | undefined;

  constructor(private botService: BotConnectorService) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.botService.getStream("dynamic-overlay").subscribe(data => {
      const oldDuration = this.duration;
      this.duration = FieldAdapter.updateField(this.duration, data.timer);

      if (this.duration === oldDuration) return;
      this.clearTimer();
      if (this.duration) this.startTimer(this.duration, 'dec');
    });
  }


  clearTimer() {
    if (this.interval !== undefined) clearInterval(this.interval);
  }

  private startTimer(timeLeft: number, direction: TimerDirection) {
    const now = new Date();
    const later = now.getTime() + 1000 * timeLeft;


    let timer = Math.round((later - now.getTime()) / 1000);
    const timerEnd = timer;

    let minutes;
    let seconds;
    let hours;
    const updateTimerDisplay = () => {
      hours = Math.floor(timer / 3600);
      minutes = Math.floor(timer / 60) % 60;
      seconds = timer % 60;

      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      if (hours !== '00') {
        this.formattedTimer = hours + ":" + minutes + ":" + seconds;
      } else {
        this.formattedTimer = minutes + ":" + seconds;
      }
    }
    const decrementTimer = () => {
      updateTimerDisplay();
      if (--timer < 0) {
        timer = 0;
        clearInterval(this.interval);
      }
    }
    const incrementTimer = () => {
      updateTimerDisplay();
      if (++timer > timerEnd) {
        timer = timerEnd;
        clearInterval(this.interval);
      }
    }
    if (direction === 'dec') { // timer counts down
      decrementTimer();
      this.interval = setInterval(decrementTimer, 1000);
    }
    else { // timer counts up
      timer = 0;
      incrementTimer();
      this.interval = setInterval(incrementTimer, 1000);
    }
  }
}
