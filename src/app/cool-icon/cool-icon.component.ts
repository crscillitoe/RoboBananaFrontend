import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-cool-icon',
  templateUrl: './cool-icon.component.html',
  styleUrls: ['./cool-icon.component.scss'],
})
export class CoolIconComponent implements OnInit, AfterViewInit {

  HALF_BAR_WIDTH = 433 / 2;
  HALF_ICON_WIDTH = 10;
  MAX_SKEW_X = 200;
  MAX_SKEW_Y = 20;
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
    const random = (Math.random() * this.HALF_BAR_WIDTH);

    return this.iconName === "cool" ? halfWidth + random : halfWidth - random;
  }

  calculateEndX() {
    const width = window.innerWidth;
    const randomSkew = Math.random() * this.MAX_SKEW_X;
    return this.iconName === "cool" ? width + randomSkew : -randomSkew;
  }

  calculateEndY() {
    const height = window.innerHeight;
    const randomSkew = Math.random() * this.MAX_SKEW_Y;

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
    this.iconImage.nativeElement.style.setProperty('--top-position-start', '7px') // icon looks centered on bar
    this.iconImage.nativeElement.style.setProperty('--left-position-start', `${startX}px`)
    this.iconImage.nativeElement.style.setProperty('--top-position-end', `${endY}px`)
    this.iconImage.nativeElement.style.setProperty('--left-position-end', `${endX}px`)
  }
}
