import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { EmoteProperties } from '../../emote-popups/emote-popups.component';
import { EmotePopupsIconPhysicalComponent } from './emote-popup-icon-physical.component';

@Component({
  selector: 'app-emote-popup-icon-physical-jump',
  templateUrl: '../emote-popup-icon.component.html',
  styleUrls: ['./emote-popup-icon-physical.component.scss'],
})
export class EmotePopupsIconPhysicalJumpComponent extends EmotePopupsIconPhysicalComponent {

  override onEmoteSpawn() {
    this.pInfo.posx = this.getRandomPositionX();
    this.pInfo.posy = this.bounceBox.y2;
    this.applyForce(this.getRandomForceX(), this.getRandomForceY() - 15);
  }

  getRandomPositionX(): number {
    var x = Math.random() * this.containerWidth;
    return Math.round(x);
  }

  getRandomPositionY(): number {
    var y = Math.random() * this.containerHeight;
    return Math.round(y);
  }

  getRandomForceX(): number {
    var f = Math.random() * 10;
    f -= 5;
    return f;
  }

  getRandomForceY(): number {
    return this.getRandomForceX();
  }
}
