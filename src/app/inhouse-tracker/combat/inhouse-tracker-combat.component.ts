import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-inhouse-tracker-combat',
  templateUrl: './inhouse-tracker-combat.component.html',
  styleUrls: ['./inhouse-tracker-combat.component.scss'],
})
export class InhouseTrackerCombatComponent {

  @Input() match!: any;

  constructor() {
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }

}
