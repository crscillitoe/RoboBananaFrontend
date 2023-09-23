import { Component, OnInit } from '@angular/core';
import { BotConnectorService } from 'src/app/services/bot-connector.service';
import { FieldAdapter } from '../field-adapter';
import { HideableComponent } from '../hideable/hideable.component';

@Component({
  selector: 'dynamic-overlay-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends HideableComponent implements OnInit {
  icon: string = "";
  left: string = "";
  right: string = "";

  constructor(private botService: BotConnectorService) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.botService.getStream("dynamic-overlay").subscribe(data => {
      this.icon = FieldAdapter.updateField(this.icon, data.headerIcon);
      this.left = FieldAdapter.updateField(this.left, data.headerLeft);
      this.right = FieldAdapter.updateField(this.right, data.headerRight);
    });
  }
}
