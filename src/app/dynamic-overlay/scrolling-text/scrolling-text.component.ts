import { Component, Input, OnInit } from '@angular/core';
import { BotConnectorService } from 'src/app/services/bot-connector.service';
import { FieldAdapter } from '../field-adapter';
import { HideableComponent } from '../hideable/hideable.component';

export type Direction = 'forwards' | 'backwards';
export type Location = 'top' | 'bottom';

@Component({
  selector: 'dynamic-overlay-scrolling-text',
  templateUrl: './scrolling-text.component.html',
  styleUrls: ['./scrolling-text.component.scss']
})
export class ScrollingTextComponent extends HideableComponent implements OnInit {
  allText?: string[];
  @Input() direction!: Direction;
  @Input() location!: Location;
  directionClass: string = "";
  locationClass: string = "";

  constructor(private botService: BotConnectorService) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.directionClass = this.direction === 'forwards' ? 'marquee' : 'marquee-backwards';
    this.locationClass = this.location === 'top' ? 'top' : 'bottom';

    this.botService.getStream("dynamic-overlay").subscribe(data => {
      this.allText = FieldAdapter.updateField(this.allText, data.scrollingText);
    });
  }

  repeat(allText: string[], numReptitions: number = 5): string[] {
    let longerAllText: string[] = [];
    for (let i = 0; i < numReptitions; i++) {
      longerAllText = longerAllText.concat(allText ?? [])
    }
    return longerAllText;
  }
}
