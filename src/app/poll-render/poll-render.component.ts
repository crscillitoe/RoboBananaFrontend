import { Component, OnInit } from '@angular/core';
import { getBaseStreamURL } from '../utility';
import { BotConnectorService } from '../services/bot-connector.service';

@Component({
  selector: 'app-poll-render',
  templateUrl: './poll-render.component.html',
  styleUrls: ['./poll-render.component.scss']
})
export class PollRenderComponent implements OnInit {
  title: string = "Who's the best valorant gamer?";
  options: string[] = ["JeyG", "Dopai", "Woohoojin", "Penflash"];
  timeLeft: number = 0;

  predictionTimer: string = "1:00"
  totalVotes: number = 0;

  timerInterval: NodeJS.Timer | undefined;

  whoVoted: Set<number> = new Set<number>();
  votes: Map<number, Set<number>> = new Map<number, Set<number>>();

  constructor(private botService: BotConnectorService) { }

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

    this.botService.getStream("polls").subscribe(data => {
      clearInterval(this.timerInterval);
      this.title = data.title;
      this.options = data.options;
      this.timeLeft = 60;
      this.resetStuff();
      this.startTimer();
      console.log(data);
    });

    this.botService.getStream("chat-message").subscribe(data => {
      // if they typed 1, vote for 1, 2 for 2, etc.
      if (data.content === "1" || data.content === "2" || data.content === "3" || data.content === "4") {
        this.processVote(data.author_id, parseInt(data.content));
      }
    });
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
