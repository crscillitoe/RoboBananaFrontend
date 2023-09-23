import { Component, OnInit } from '@angular/core';
import { BotConnectorService } from 'src/app/services/bot-connector.service';
import { FieldAdapter } from '../field-adapter';
import { HideableComponent } from '../hideable/hideable.component';

@Component({
  selector: 'dynamic-overlay-background-video',
  templateUrl: './background-video.component.html',
  styleUrls: ['./background-video.component.scss']
})
export class BackgroundVideoComponent extends HideableComponent implements OnInit {
  videoUrl?: string;

  constructor(private botService: BotConnectorService) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.botService.getStream("dynamic-overlay").subscribe(data => {
      this.videoUrl = FieldAdapter.updateField(this.videoUrl, data.backgroundVideo);
    });
  }
}
