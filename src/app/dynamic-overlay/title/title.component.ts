import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BotConnectorService } from 'src/app/services/bot-connector.service';
import { FieldAdapter } from 'src/app/dynamic-overlay/field-adapter';
import { HideableComponent } from '../hideable/hideable.component';
import { trigger, transition, style, animate } from '@angular/animations';

const URL_REGEX = new RegExp(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/);

@Component({
  selector: 'dynamic-overlay-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent extends HideableComponent implements OnInit {
  title?: string;
  @ViewChild("titleRef") titleRef!: ElementRef;

  constructor(private botService: BotConnectorService) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.botService.getStream("dynamic-overlay").subscribe(data => {
      this.title = FieldAdapter.updateField(this.title, data.title);
    });
  }

  splitTitle(title: string): string[] {
    return title.split("<br>") || []
  }

  titleIsImage(title: string): boolean {
    return URL_REGEX.test(title || "");
  }
}
