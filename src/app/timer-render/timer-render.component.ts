import { Component, OnInit } from '@angular/core';
import { getBaseStreamURL } from '../utility';

export type TimerDirection = "inc" | "dec";

@Component({
  selector: 'app-timer-render',
  templateUrl: './timer-render.component.html',
  styleUrls: ['./timer-render.component.scss']
})

export class TimerRenderComponent implements OnInit {
  predictionTimer = "00:00"
  timerInterval: NodeJS.Timer | undefined;

  ngOnInit(): void {
    const streamURL = getBaseStreamURL() + "?channel=timer"
    let source = new EventSource(streamURL);

    source.addEventListener('open', (e) => {
      console.log("The connection has been established.");
    });

    source.addEventListener('publish', (event) => {
      let data = JSON.parse(event.data);
      console.log(data);
      clearInterval(this.timerInterval);
      this.startTimer(data.time, data.direction);
    }, false);
    source.addEventListener('error', function (event) {
      console.log(event)
    }, false);
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
        this.predictionTimer = hours + ":" + minutes + ":" + seconds;
      } else {
        this.predictionTimer = minutes + ":" + seconds;
      }
    }
    const decrementTimer = () => {
      updateTimerDisplay();
      if (--timer < 0) {
        timer = 0;
        clearInterval(this.timerInterval);
      }
    }
    const incrementTimer = () => {
      updateTimerDisplay();
      if (++timer > timerEnd) {
        timer = timerEnd;
        clearInterval(this.timerInterval);
      }
    }
    if (direction === 'dec') { // timer counts down
      decrementTimer();
      this.timerInterval = setInterval(decrementTimer, 1000);
    }
    else {
      timer = 0;
      incrementTimer();
      this.timerInterval = setInterval(incrementTimer, 1000);
    }
  }
}
