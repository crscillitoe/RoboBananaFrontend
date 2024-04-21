import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-inhouse-tracker-playerscore',
  templateUrl: './inhouse-tracker-playerscore.component.html',
  styleUrls: ['./inhouse-tracker-playerscore.component.scss'],
})
export class InhouseTrackerPlayerscoreComponent {

  @Input() match!: any;
  @Input() player!: any;
  @Input() color!: "red" | "green";
  @Input() side!: "left" | "right";

  constructor() {
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }

}
