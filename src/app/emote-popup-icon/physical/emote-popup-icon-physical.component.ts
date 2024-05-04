import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { EmoteProperties } from '../../emote-popups/emote-popups.component';
import { TickController } from './TickController';

@Component({
  selector: 'app-emote-popup-icon-physical',
  templateUrl: '../emote-popup-icon.component.html',
  styleUrls: ['./emote-popup-icon-physical.component.scss'],
})
export class EmotePopupsIconPhysicalComponent implements OnInit, AfterViewInit {

  protected static tickController: TickController = new TickController(30);

  @Input() iconName = '';
  public imageAsset = '';
  public textAsset = '';

  public properties!: EmoteProperties;

  //documentation for these values is in 'emote-popups.component.ts', where they should be maintained
  public size: number = 40;
  public bounces: number = 2;

  public containerWidth: number = 1566; //set by owner component
  public containerHeight: number = 324; //set by owner component

  protected gravity: number = 1;

  public customCheckFunction?: Function;

  protected bounceBox = {
    x1: 0,
    x2: 1,
    y1: 0,
    y2: 1
  }
  protected destroyBox = {
    x1: 0,
    x2: 1,
    y1: 0,
    y2: 1
  }

  protected pInfo: PhysicsInfo = new PhysicsInfo();

  @ViewChild('emoteContainer') emoteContainer!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    this.setupProperties();
    if (this.iconName === '') return;

    this.imageAsset = `assets/${this.iconName}.webp`
  }

  ngAfterViewInit(): void {
    this.setupBoxes();
    this.onEmoteSpawn();

    this.emoteContainer.nativeElement.style.setProperty("--emote-pos-x", this.pInfo.posx + "px");
    this.emoteContainer.nativeElement.style.setProperty("--emote-pos-y", this.pInfo.posy + "px");
    this.emoteContainer.nativeElement.style.setProperty("--emote-size", this.size + "px");

    EmotePopupsIconPhysicalComponent.tickController.add(this);
  }

  setupProperties() {
    if (this.properties.type == "img")
      this.imageAsset = this.properties.asset;
    else if (this.properties.type == "text")
      this.textAsset = this.properties.asset;

    this.size = this.properties.size;
    this.bounces = this.properties.bounces;
    this.containerHeight = this.properties.containerHeight;
    this.containerWidth = this.properties.containerWidth;
    this.pInfo = structuredClone(this.properties.initialPhysicsState);
  }

  setupBoxes() {
    this.bounceBox = {
      x1: 0,
      x2: this.containerWidth,
      y1: 0,
      y2: this.containerHeight - this.size
    };

    this.destroyBox = {
      x1: 0 - this.size * 2,
      x2: this.containerWidth + this.size * 2,
      y1: 0 - this.size * 5,
      y2: this.containerHeight + this.size * 2
    };
  }

  onEmoteSpawn() {

  }

  doAnimationStep() {
    this.pInfo.accy += this.gravity;

    this.pInfo.velx += this.pInfo.accx;
    this.pInfo.vely += this.pInfo.accy;

    this.pInfo.posx += this.pInfo.velx;
    this.pInfo.posy += this.pInfo.vely;

    this.emoteContainer.nativeElement.style.setProperty("--emote-pos-x", this.pInfo.posx + "px");
    this.emoteContainer.nativeElement.style.setProperty("--emote-pos-y", this.pInfo.posy + "px");

    this.pInfo.accx = 0;
    this.pInfo.accy = 0;

    this.checkBounceBox();
    this.checkCustomCheck();
    this.checkDestroyBox();
  }

  checkBounceBox() {
    if (this.bounces <= 0) return;
    if (this.pInfo.posx < this.bounceBox.x1 || this.pInfo.posx > this.bounceBox.x2) {
      this.pInfo.velx *= -1;
    }
    if (this.pInfo.posy > this.bounceBox.y2) {
      this.pInfo.vely *= -1;
      this.pInfo.posy = this.bounceBox.y2;
      this.bounces--;

    }
  }

  checkCustomCheck() {
    if (this.customCheckFunction) {
      this.customCheckFunction(this.pInfo);
    }
  }

  checkDestroyBox() {
    if (this.pInfo.posx < this.destroyBox.x1 || this.pInfo.posx > this.destroyBox.x2) {
      this.stopAnimation();
    }
    else if (this.pInfo.posy < this.destroyBox.y1 || this.pInfo.posy > this.destroyBox.y2) {
      this.stopAnimation();
    }
  }

  stopAnimation() {
    EmotePopupsIconPhysicalComponent.tickController.remove(this);
    this.destroySelf();
  }

  applyForce(x: number, y: number) {
    this.pInfo.accx += x;
    this.pInfo.accy += y;
  }

  /**
   * Code to have the owner component properly destroy this emote popup when the animation is finished.
   * Owner has to subscribe to closeObservable and destroy the component when fired.
   */
  protected closeSubject = new Subject<boolean>();
  get closeObservable() {
    return this.closeSubject.asObservable();
  }
  protected destroySelf() {
    this.closeSubject.next(true);
  }
}

export class PhysicsInfo {
  public posx: number = 0;
  public posy: number = 0;
  public velx: number = 0;
  public vely: number = 0;
  public accx: number = 0;
  public accy: number = 0;
}
