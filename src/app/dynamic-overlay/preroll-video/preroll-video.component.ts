import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BotConnectorService } from 'src/app/services/bot-connector.service';
import { FieldAdapter } from '../field-adapter';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'dynamic-overlay-preroll-video',
  templateUrl: './preroll-video.component.html',
  styleUrls: ['./preroll-video.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms ease', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('1000ms ease', style({ opacity: 0 }))
      ])
    ]),
  ]
})
export class PrerollVideoComponent implements OnInit {
  display: boolean = true;
  videoUrl?: string;
  @Output() ended: EventEmitter<void> = new EventEmitter();

  constructor(private botService: BotConnectorService) { }
  ngOnInit(): void {
    this.botService.getStream("dynamic-overlay").subscribe(data => {
      this.videoUrl = FieldAdapter.updateField(this.videoUrl, data.preRollVideo);
    });
  }

  onEnd(): void {
    this.display = false;
    this.ended.emit();
  }
}
