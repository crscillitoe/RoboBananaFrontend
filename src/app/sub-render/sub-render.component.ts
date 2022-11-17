import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sub-render',
  templateUrl: './sub-render.component.html',
  styleUrls: ['./sub-render.component.scss']
})
export class SubRenderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    let streamURL = decodeURIComponent(window.location.search);
    streamURL = streamURL.slice(1, streamURL.length - 1);
    streamURL += "?channel=subs"
    let source = new EventSource(streamURL);
    source.addEventListener('open', (e) => {
      console.log("The connection has been established.");
    });
    source.addEventListener('publish', (event) => {
      var data = JSON.parse(event.data);
      // TODO: Play animation
      console.log(data);
    }, false);
    source.addEventListener('error', function (event) {
      console.log(event)
    }, false);
  }

}
