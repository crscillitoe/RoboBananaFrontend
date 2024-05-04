import { Component, ComponentRef } from '@angular/core';
import { EmotePopupsComponent, EmoteProperties } from '../emote-popups.component';
import { EmotePopupsIconPhysicalComponent, PhysicsInfo } from 'src/app/emote-popup-icon/physical/emote-popup-icon-physical.component';
import { EmotePopupsAnimationFountain1 } from '../animations/emote-popups-animation-fountain1';
import { EmotePopupsAnimation } from '../animations/emote-popups-animation';
import { EmotePopupIconComponent } from 'src/app/emote-popup-icon/emote-popup-icon.component';
import { EmotePopupsAnimationFireworks1 } from '../animations/emote-popups-animation-fireworks1';

@Component({
  selector: 'app-emote-popups-special',
  templateUrl: '../emote-popups.component.html',
  styleUrls: ['../emote-popups.component.scss']
})
export class EmotePopupsComponentSpecial extends EmotePopupsComponent {

  animations: Map<String, EmotePopupsAnimation> = new Map();

  protected timeframe = 30 * 1000;
  protected triggerThreshhold = 15;
  protected emoteUsages: { [id: string] : number[] } = {};

  override ngOnInit(): void {
    super.ngOnInit();

    this.animations.set("fountains", new EmotePopupsAnimationFountain1(this._createPopupEmoteContainer.bind(this)));
    this.animations.set("fireworks", new EmotePopupsAnimationFireworks1(this._createPopupEmoteContainer.bind(this)));
  }

  override filterEmotes(properties: EmoteProperties): boolean {
    let amountInLastTimeframe = this.findAmountUsedLastTimeframe(properties.asset);
    if (amountInLastTimeframe > this.triggerThreshhold) {
      this.emoteUsages = {};
      this.startRandomAnimation(properties.asset, properties.type);
    }
    return false;
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

  override onStreamdeckData(data: any): void {
    super.onStreamdeckData(data);
    const animation = this.animations.get(data.animation);
    if (animation) {
      let emoteList = [];
      if (data.emotes) {
        emoteList = data.emotes.split(",");
      }
      if (emoteList.length == 0) {
        emoteList = ["assets/cool.webp"];
      }
      animation.startAnimation(emoteList);
    }
  }

  startRandomAnimation(emote: string, type: "img" | "text" = "img") {
    let values = [...this.animations.values()];
    let index = Math.random() * (values.length-1);
    index = Math.round(index);
    values[index].startAnimation([emote], type);
  }

  override _getPopupEmoteContainerRef() {
    const viewContainerRef = this.emotePopupSpace.viewContainerRef;
    return viewContainerRef.createComponent<EmotePopupsIconPhysicalComponent>(EmotePopupsIconPhysicalComponent);
  }

  override _createPopupEmoteContainer(properties: EmoteProperties): ComponentRef<EmotePopupIconComponent> | null {
    return super._createPopupEmoteContainer(structuredClone(properties));
  }
}