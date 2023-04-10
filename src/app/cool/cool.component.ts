import { Component, OnInit, ViewChild } from '@angular/core';
import { CoolIconComponent } from '../cool-icon/cool-icon.component';
import { CoolIconDirective } from './cool-icon-directive';
import { timer } from "rxjs";

@Component({
  selector: 'app-cool',
  templateUrl: './cool.component.html',
  styleUrls: ['./cool.component.scss']
})
export class CoolComponent implements OnInit {
  cool: number = 0;

  thresholds: number = 50;
  @ViewChild(CoolIconDirective, { static: true }) coolIconHost!: CoolIconDirective;

  calculateWidth() {
    let neutralCool = Math.abs(this.cool);
    if (neutralCool > 50) {
      return 50;
    }

    return neutralCool;
  }

  calculateRemainder() {
    return 50 - this.calculateWidth();
  }

  constructor() { }
  ngOnInit(): void {
    let streamURL = decodeURIComponent(window.location.search);
    streamURL = streamURL.slice(1, streamURL.length - 1);
    streamURL += "?channel=cool"
    var source = new EventSource(streamURL);
    source.addEventListener('open', (e) => {
      console.log("The connection has been established.");
    });
    source.addEventListener('publish', (event) => {
      var data = JSON.parse(event.data);
      let cool = data.cool;
      this.cool += cool;

      if (this.cool > 50) {
        this.cool = 50;
      }

      if (this.cool < -50) {
        this.cool = -50;
      }

      // Dynamically create icon component
      const viewContainerRef = this.coolIconHost.viewContainerRef;
      const componentRef = viewContainerRef.createComponent<CoolIconComponent>(CoolIconComponent);

      const iconName = cool > 0 ? "cool" : "uncool";
      componentRef.instance.iconName = iconName;

      // Animation takes 1s
      // Clean up after the element is no longer visible
      timer(3200).subscribe(() => {
        componentRef.destroy();
      })

    }, false);
    source.addEventListener('error', function (event) {
      console.log(event)
    }, false);
  }
}
