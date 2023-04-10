import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-cool-icon',
  templateUrl: './cool-icon.component.html',
  styleUrls: ['./cool-icon.component.scss'],
})
export class CoolIconComponent implements OnInit, AfterViewInit {

  QUARTER_BAR_WIDTH = 433 / 4;
  HALF_ICON_WIDTH = 40;
  MAX_SKEW_X = 100;
  MAX_SKEW_Y = 400;
  @Input() iconName = '';
  public imageAsset = '';

  @ViewChild('iconImage') iconImage!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    if (this.iconName === '') return;

    this.imageAsset = `assets/${this.iconName}.webp`
  }

  calculateStartX() {
    const width = window.innerWidth;
    const halfWidth = (width / 2) - this.HALF_ICON_WIDTH;
    const random = (Math.random() * this.QUARTER_BAR_WIDTH);

    if (Math.random() > 0.5) {
      return halfWidth + random;
    } else {
      return halfWidth - random;
    }
  }

  calculateEndX() {
    const width = window.innerWidth;
    const randomSkew = Math.random() * this.MAX_SKEW_X;

    if (Math.random() > 0.5) {
      return width + randomSkew;
    } else {
      return -randomSkew;
    }
  }

  calculateEndY() {
    const height = window.innerHeight;
    const randomSkew = Math.max(Math.random() * this.MAX_SKEW_Y, 50);

    // Flip a coin for whether we randomly fly up or down
    if (Math.random() > 0.5) {
      return height + randomSkew;
    } else {
      return -randomSkew;
    }
  }

  ngAfterViewInit(): void {
    const startX = this.calculateStartX();
    const endX = this.calculateEndX();
    const endY = this.calculateEndY();
    console.log(endY)
    this.iconImage.nativeElement.style.setProperty('--top-position-start', '7px') // icon looks centered on bar
    this.iconImage.nativeElement.style.setProperty('--left-position-start', `${startX}px`)
    this.iconImage.nativeElement.style.setProperty('--top-position-end', `${endY}px`)
    this.iconImage.nativeElement.style.setProperty('--left-position-end', `${endX}px`)
  }
}
