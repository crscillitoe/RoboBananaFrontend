import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-talking-png',
  templateUrl: './talking-png.component.html',
  styleUrls: ['./talking-png.component.scss']
})
export class TalkingPngComponent implements OnInit {
  @Input() talkingImages: string[] = [];
  @Input() quietImages: string[] = [];
  @Input() isTalking!: BehaviorSubject<boolean>;

  constructor() { }

  ngOnInit(): void {
  }

}
