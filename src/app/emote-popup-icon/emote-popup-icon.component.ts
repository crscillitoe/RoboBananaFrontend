import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-emote-popup-icon',
  templateUrl: './emote-popup-icon.component.html',
  styleUrls: ['./emote-popup-icon.component.scss'],
})
export class EmotePopupIconComponent implements OnInit, AfterViewInit {

  @Input() iconName = '';
  public imageAsset = '';

  @ViewChild('iconImage') iconImage!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    if (this.iconName === '') return;

    this.imageAsset = `assets/${this.iconName}.webp`
  }

  ngAfterViewInit(): void {
    this.iconImage.nativeElement.style.setProperty('--left-position-start', `${Math.random()*100}%`);
    this.iconImage.nativeElement.style.setProperty('--jump-height', `${Math.random()*100}%`);
  }
}
