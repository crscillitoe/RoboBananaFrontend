import { Component, OnInit } from '@angular/core';
import { BotConnectorService } from 'src/app/services/bot-connector.service';
import { FieldAdapter, MediaField, TextField } from '../field-adapter';
import { HideableComponent } from '../hideable/hideable.component';

@Component({
  selector: 'dynamic-overlay-side-banner',
  templateUrl: './side-banner.component.html',
  styleUrls: ['./side-banner.component.scss']
})
export class SideBannerComponent extends HideableComponent implements OnInit {
  icon?: MediaField | null;
  lineOne?: TextField | null;
  lineTwo?: TextField | null;
  lineThree?: TextField | null;

  constructor(private botService: BotConnectorService) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.botService.getStream("dynamic-overlay").subscribe(data => {
      this.icon = FieldAdapter.updateField(this.icon, data.sideBannerIcon);
      this.lineOne = FieldAdapter.updateField(this.lineOne, data.sideBannerTextOne);
      this.lineTwo = FieldAdapter.updateField(this.lineTwo, data.sideBannerTextTwo);
      this.lineThree = FieldAdapter.updateField(this.lineThree, data.sideBannerTextThree);
    });
  }
}
