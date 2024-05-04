import { Component } from '@angular/core';
import { EmotePopupsComponent, EmoteProperties } from '../emote-popups.component';
import { EmotePopupsIconPhysicalJumpComponent } from 'src/app/emote-popup-icon/physical/emote-popup-icon-physical-jump.component';

@Component({
  selector: 'app-emote-popups-multiple',
  templateUrl: '../emote-popups.component.html',
  styleUrls: ['../emote-popups.component.scss']
})
export class EmotePopupsComponentMultiple extends EmotePopupsComponent {

  protected amount = 0;
  protected timeframe = 10 * 1000;
  protected emoteUsages: { [id: string] : number[] } = {};

  override adjustEmoteProperties(properties: EmoteProperties): void {
    let amountInLastTimeframe = this.findAmountUsedLastTimeframe(properties.asset);
    properties.amount = this.amountFunction(amountInLastTimeframe);
  }

  override _getPopupEmoteContainerRef() {
    const viewContainerRef = this.emotePopupSpace.viewContainerRef;
    return viewContainerRef.createComponent<EmotePopupsIconPhysicalJumpComponent>(EmotePopupsIconPhysicalJumpComponent);
  }

  findAmountUsedLastTimeframe(emote: string): number {
    let now = Date.now();
    let latestTimestampAcceptable = now - this.timeframe;

    let usages = this.emoteUsages[emote];
    if (!usages) {
      usages = [];
    }
    usages = usages.filter((e) => {
      return e >= latestTimestampAcceptable;
    });
    let result = usages.length;

    usages.push(now);
    this.emoteUsages[emote] = usages;

    return result;
  }

  amountFunction(amountInLastTimeframe: number): number {
    let hist = amountInLastTimeframe;

    let a = 2, b = 2, c = -0.4, d = 1, e = 1;
    let result = Math.pow(a, c*hist+d) * b + e;

    result = Math.round(result);
    
    return result;
  }

}