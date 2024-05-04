import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { EmoteProperties } from '../emote-popups/emote-popups.component';

@Component({
  selector: 'app-emote-popup-icon',
  templateUrl: './emote-popup-icon.component.html',
  styleUrls: ['./emote-popup-icon.component.scss'],
})
export class EmotePopupIconComponent implements OnInit, AfterViewInit {

  @Input() iconName = '';
  public imageAsset = '';
  public textAsset = '';

  public properties!: EmoteProperties;

  //documentation for these values is in 'emote-popups.componen.ts', where they should be maintained
  public duration: number = 1500;
  public size: number = 40;
  public direction: string = "up";

  @ViewChild('emoteContainer') emoteContainer!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    if (this.iconName === '') return;

    this.imageAsset = `assets/${this.iconName}.webp`
  }

  ngAfterViewInit(): void {
    this.setupProperties();
    let position = this.getRandomPosition();
    let height = this.getRandomJumpHeight();
    this.emoteContainer.nativeElement.classList.add(this.direction);
    this.emoteContainer.nativeElement.style.setProperty('--position-start', `${position}%`);
    this.emoteContainer.nativeElement.style.setProperty('--jump-height', `${height}%`);
    this.emoteContainer.nativeElement.style.setProperty("--animation-duration", this.duration + "ms");
    this.emoteContainer.nativeElement.style.setProperty("--emote-size", this.size + "px");
    setTimeout(() => this.closeSubject.next(true), this.duration);
  }

  setupProperties() {
    if (this.properties.type == "img")
      this.imageAsset = this.properties.asset;
    else if (this.properties.type == "text")
      this.textAsset = this.properties.asset;

    this.direction = this.direction;
    this.size = this.properties.size;
    this.duration = this.properties.duration;
  }

  /**
   * Position is outsourced to css with percental positioning
   * This ensures that the emotes can fill up the entire container
   * We just return an integer between 100 and 0
   * It is advised that the container is one emote width smaller than the full widht available, so emotes dont get cut off
   */
  getRandomPosition(): number {
    var x = Math.random() * 100;
    return Math.round(x);
  }

  /**
   * Jump height is outsourced to css with percental positioning
   * This ensures that the emotes can fill up the entire container
   * We just return an integer between 100 and 0
   * A minimum jump height is enforced though, because otherwise there can be emotes that dont jump high enough
   */
  getRandomJumpHeight(): number {
    var x = Math.random() * 100;
    x = Math.min(x, 50); //70 is minimum jump height, otherwise it looks bad
    return Math.round(x);
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
