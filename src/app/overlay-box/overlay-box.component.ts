import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-overlay-box',
  templateUrl: './overlay-box.component.html',
  styleUrls: ['./overlay-box.component.scss']
})
export class OverlayBoxComponent implements OnInit {

  @Input() imageName = "";

  constructor() { }

  ngOnInit(): void {
  }

}
