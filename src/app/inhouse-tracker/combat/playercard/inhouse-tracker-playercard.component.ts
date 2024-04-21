import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-inhouse-tracker-playercard',
  templateUrl: './inhouse-tracker-playercard.component.html',
  styleUrls: ['./inhouse-tracker-playercard.component.scss'],
})
export class InhouseTrackerPlayercardComponent {

  @Input() match!: any;
  @Input() player!: any;
  @Input() color!: "red" | "green";
  @Input() side!: "left" | "right";

  constructor() {
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }

  capitalizeColor(s: string) {
    return s[0].toUpperCase() + s.substring(1);
  }

}
