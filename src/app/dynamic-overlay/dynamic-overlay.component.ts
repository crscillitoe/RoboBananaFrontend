import { Component, EventEmitter, OnInit } from '@angular/core';
import { BotConnectorService } from '../services/bot-connector.service';
import { FieldAdapter } from './field-adapter';

@Component({
  selector: 'app-dynamic-overlay',
  templateUrl: './dynamic-overlay.component.html',
  styleUrls: ['./dynamic-overlay.component.scss']
})
export class DynamicOverlayComponent implements OnInit {
  display: boolean = false;
  displayEmitter: EventEmitter<boolean> = new EventEmitter();
  constructor(private botService: BotConnectorService) { }

  preRollEnded() {
    this.display = true;
  }

  ngOnInit(): void {
    this.botService.getStream("dynamic-overlay").subscribe(data => {
      if (data.preRollVideo) return;
      const oldDisplay = this.display;
      this.display = FieldAdapter.updateField(this.display, data.display);
      if (oldDisplay !== this.display) this.displayEmitter.emit(this.display);
    })
  }
}