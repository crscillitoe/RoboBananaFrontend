import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.scss']
})
export class AnimationComponent implements OnDestroy, AfterViewInit {
  source: string = "";
  image = false;
  video = false;
  playing = false;

  contentLoadedCallack!: Function;

  @ViewChild('videoPlayer') videoPlayer!: ElementRef;

  constructor(public viewContainerRef: ViewContainerRef) { }

  ngAfterViewInit(): void {
    this.videoPlayer.nativeElement.onloadeddata = this._videoLoaded.bind(this);
  }

  ngOnDestroy(): void {
    this.playing = false;
    this.image = false;
    this.video = false;
    this.source = "";
  }

  _imageLoaded() {
    if (this.playing) return;
    this.playing = true;
    this.image = true;
    this.contentLoaded();
  }

  _videoLoaded() {
    if (this.playing) return;
    this.playing = true;
    this.video = true;
    this.contentLoaded();
  }

  contentLoaded(): void {
    this.contentLoadedCallack();
  }
}
