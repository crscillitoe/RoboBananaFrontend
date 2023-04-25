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
  cool: number = 10;

  thresholds: number = 100;
  @ViewChild(CoolIconDirective, { static: true }) coolIconHost!: CoolIconDirective;

  calculateWidth() {
    if (this.cool > 100) {
      return 100;
    }

    return this.cool;
  }

  calculateRemainder() {
    return 100 - this.calculateWidth();
  }

  constructor() { }
  ngOnInit(): void {
    const updateCool = () => {
      if (this.cool > 10) {
        this.cool--;
      }
    }

    setInterval(updateCool, 5000);

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

      if (this.cool > 100) {
        this.cool = 100;
      }

      if (this.cool < 0) {
        this.cool = 0;
      }

      // Dynamically create icon component
      const viewContainerRef = this.coolIconHost.viewContainerRef;
      const componentRef = viewContainerRef.createComponent<CoolIconComponent>(CoolIconComponent);

      const iconName = cool > 0 ? "cool" : "uncool";
      componentRef.instance.iconName = iconName;

      // Animation takes 1s
      // Clean up after the element is no longer visible
      timer(1200).subscribe(() => {
        componentRef.destroy();
      })

    }, false);
    source.addEventListener('error', function (event) {
      console.log(event)
    }, false);
  }
}
