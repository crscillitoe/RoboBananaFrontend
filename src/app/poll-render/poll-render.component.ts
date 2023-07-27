import { Component, OnInit } from '@angular/core';
import { getBaseStreamURL } from '../utility';

@Component({
  selector: 'app-poll-render',
  templateUrl: './poll-render.component.html',
  styleUrls: ['./poll-render.component.scss']
})
export class PollRenderComponent implements OnInit {
  title: string = "Who's the best valorant gamer?";
  options: string[] = ["JeyG", "Dopai", "", ""];
  timeLeft: number = 0;

  predictionTimer: string = "1:00"
  totalVotes: number = 0;

  timerInterval: NodeJS.Timer | undefined;

  whoVoted: Set<number> = new Set<number>();
  votes: Map<number, Set<number>> = new Map<number, Set<number>>();

  constructor() { }

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
    const streamURL = getBaseStreamURL();
    const newPollURL = streamURL + "?channel=polls"
    const newPollAnswerURL = streamURL + "?channel=poll-answers"

    const newPollSource = new EventSource(newPollURL);
    const newPollAnswerSource = new EventSource(newPollAnswerURL);

    newPollSource.addEventListener('publish', (event) => {
      /*
        {
          "title": "This is a sample poll",
          "options": [
              "Sample text",
              "123",
              "another option",
              "these are options"
          ]
        }
       */
      let data = JSON.parse(event.data);

      clearInterval(this.timerInterval);
      this.title = data.title;
      this.options = data.options;
      this.timeLeft = 60;
      this.resetStuff();
      this.startTimer();
      console.log(data);
    }, false);

    newPollAnswerSource.addEventListener('publish', (event) => {
      /*
        {
           "userID": 12938123,
           "optionNumber": 1,
           "userRoleIDs": [123, 823, 231, 293]
        }
       */
      let data = JSON.parse(event.data);
      console.log(data);
      this.processVote(data.userID, data.optionNumber);
    }, false);




    // ----------------------------------------------------
    // ERRORS AND INITIAL CONNECTIONS
    newPollSource.addEventListener('open', (e) => {
      console.log("The connection has been established.");
    });
    newPollAnswerSource.addEventListener('open', (e) => {
      console.log("The connection has been established.");
    });
    newPollSource.addEventListener('error', function (event) {
      console.log(event)
    }, false);
    newPollAnswerSource.addEventListener('error', function (event) {
      console.log(event)
    }, false);
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
