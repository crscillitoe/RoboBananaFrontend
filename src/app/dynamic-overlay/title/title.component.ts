import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BotConnectorService } from 'src/app/services/bot-connector.service';
import { FieldAdapter, TextField, MediaField, Field } from 'src/app/dynamic-overlay/field-adapter';
import { HideableComponent } from '../hideable/hideable.component';

@Component({
  selector: 'dynamic-overlay-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent extends HideableComponent implements OnInit {
  title?: Field | null;
  textTitle?: TextField | null;
  imageTitle?: MediaField | null;
  @ViewChild("titleRef") titleRef!: ElementRef;

  constructor(private botService: BotConnectorService) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.botService.getStream("dynamic-overlay").subscribe(data => {
      this.title = FieldAdapter.updateField(this.title, data.title);
      if (FieldAdapter.isText(this.title)) {
        this.textTitle = this.title;
        this.imageTitle = null;
      }

      if (FieldAdapter.isMedia(this.title)) {
        this.textTitle = null;
        this.imageTitle = this.title;
      }
    });
  }

  splitTitle(title: string): string[] {
    return title.split("<br>") || []
  }
}
