import { Component, OnInit } from '@angular/core';
import { BotConnectorService } from 'src/app/services/bot-connector.service';
import { Field, FieldAdapter, MediaField } from '../field-adapter';
import { HideableComponent } from '../hideable/hideable.component';

@Component({
  selector: 'dynamic-overlay-background-video',
  templateUrl: './background-video.component.html',
  styleUrls: ['./background-video.component.scss']
})
export class BackgroundVideoComponent extends HideableComponent implements OnInit {
  videoField?: MediaField | null;

  constructor(private botService: BotConnectorService) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.botService.getStream("dynamic-overlay").subscribe(data => {
      this.videoField = FieldAdapter.updateField(this.videoField, data.backgroundVideo);
    });
  }
}
