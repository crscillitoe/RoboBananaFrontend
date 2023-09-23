import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hideable',
  templateUrl: './hideable.component.html',
  styleUrls: ['./hideable.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: "translateX(-100%)" }),
        animate('500ms ease-in-out', style({ transform: "translateX(0%)" })),
      ]),
      transition(':leave', [
        animate('500ms ease-in-out', style({ transform: "translateX(-100%)" }))
      ])
    ]),
    trigger('slideInOutCenterScreen', [
      transition(':enter', [
        style({ transform: "translate(-100%, 50vh)" }),
        animate('500ms ease-in-out', style({ transform: "translate(0%, 50vh)" })),
      ]),
      transition(':leave', [
        style({ transform: "translate(0%, 50vh)" }),
        animate('500ms ease-in-out', style({ transform: "translate(-100%, 50vh)" }))
      ])
    ]),
  ]
})
export class HideableComponent implements OnInit {
  display: boolean = false;
  @Input() displayChange!: EventEmitter<boolean>;

  constructor() { }
  ngOnInit(): void {
    this.displayChange.subscribe((newDisplay) => {
      this.display = newDisplay;
    });
  }
}
