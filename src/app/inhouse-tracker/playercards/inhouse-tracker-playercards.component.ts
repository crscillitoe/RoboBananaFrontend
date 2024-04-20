import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-inhouse-tracker-playercards',
  templateUrl: './inhouse-tracker-playercards.component.html',
  styleUrls: ['./inhouse-tracker-playercards.component.scss'],
})
export class InhouseTrackerPlayercardsComponent {

  @Input() match!: any;

  constructor() {
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }

}
