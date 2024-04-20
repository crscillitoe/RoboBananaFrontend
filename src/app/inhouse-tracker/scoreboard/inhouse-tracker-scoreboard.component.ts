import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-inhouse-tracker-scoreboard',
  templateUrl: './inhouse-tracker-scoreboard.component.html',
  styleUrls: ['./inhouse-tracker-scoreboard.component.scss'],
})
export class InhouseTrackerScoreboardComponent {

  @Input() match!: any;

  constructor() {
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }

}
