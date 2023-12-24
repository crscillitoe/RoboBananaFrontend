import { Component, OnInit } from '@angular/core';
import { BotConnectorService } from '../services/bot-connector.service';

@Component({
  selector: 'app-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.scss']
})
export class AnimationComponent implements OnInit {
  display: boolean = false;
  source: string = "";

  constructor(private botService: BotConnectorService) { }

  ngOnInit(): void {
    this.botService.getStream('streamdeck').subscribe(data => {
      if (data.type === "animation") {
        this.display = true;
        this.source = data.source;

        setTimeout(() => {
          this.display = false;
        }, data.duration * 1000);
      }
    });
  }
}
