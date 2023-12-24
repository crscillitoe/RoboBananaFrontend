import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {BotConnectorService} from '../services/bot-connector.service';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {map, switchMap} from "rxjs";

@Component({
  selector: 'app-poll-render',
  templateUrl: './poll-render.component.html',
  styleUrls: ['./poll-render.component.scss']
})

export class PollRenderComponent implements OnInit {
  title = "Who's the best valorant gamer?";
  options = ["JeyG", "Dopai", "Woohoojin", "Penflash"];
  timeLeft = 0;
  predictionTimer = "1:00"
  totalVotes = 0;
  timerInterval: NodeJS.Timer | undefined;
  whoVoted: Set<number> = new Set<number>();
  votes: Map<number, Set<number>> = new Map<number, Set<number>>();

  private readonly _botService = inject(BotConnectorService);
  private readonly _destroyRef = inject(DestroyRef);

  getBarWidth(barID: number) {
    if (this.totalVotes === 0) {
      return 0;
    }

    return Math.round((this.votes.get(barID)!.size / this.totalVotes) * 100);
  }

  processVote(userID: number, voteID: number) {
    console.log(userID, voteID);

    if (this.options[voteID - 1] !== "") {
      this.votes.get(1)!.delete(userID);
      this.votes.get(2)!.delete(userID);
      this.votes.get(3)!.delete(userID);
      this.votes.get(4)!.delete(userID);

      this.whoVoted.add(userID);
      this.votes.get(voteID)!.add(userID)
      this.totalVotes = this.whoVoted.size;
    }
  }

  resetStuff() {
    this.totalVotes = 0;
    this.whoVoted = new Set<number>();
    this.votes.set(1, new Set<number>());
    this.votes.set(2, new Set<number>());
    this.votes.set(3, new Set<number>());
    this.votes.set(4, new Set<number>());
  }

  ngOnInit(): void {
    this.resetStuff();

    this._botService.getStream('polls').pipe(
      takeUntilDestroyed(this._destroyRef),
      switchMap((data) => {

        this.title = data.title;
        this.options = data.options;
        this.timeLeft = 60;
        this.resetStuff();
        this.startTimer();

        return this._botService.getStream('chat-message').pipe(
          map((data) => {
            if (data.content.includes(["1", "2", "3", "4"])) {
              this.processVote(data.author_id, parseInt(data.content));
            }
          })
        )
      })
    ).subscribe();
  }

  private startTimer() {
    const now = new Date();
    const later = now.getTime() + 60000;

    let timer = Math.round((later - now.getTime()) / 1000);

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
        this.timeLeft = 0;
        clearInterval(this.timerInterval);
      }
    }
    updateTimer();
    this.timerInterval = setInterval(updateTimer, 1000);
  }

}
