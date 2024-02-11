import { Component, OnInit, ViewChild } from '@angular/core';
import { EmotePopupIconComponent } from '../emote-popup-icon/emote-popup-icon.component';
import { EmotePopupsDirective } from './emote-popups-directive';
import { timer } from "rxjs";
import { getBaseStreamURL } from '../utility';
import { BotConnectorService } from '../services/bot-connector.service';

@Component({
  selector: 'app-emote-popups',
  templateUrl: './emote-popups.component.html',
  styleUrls: ['./emote-popups.component.scss']
})
export class EmotePopupsComponent implements OnInit {

  @ViewChild(EmotePopupsDirective, { static: true }) emotePopupSpace!: EmotePopupsDirective;

  constructor(private botService: BotConnectorService) { }

  ngOnInit(): void {
    this.botService.getStream("streamdeck").subscribe(data => {

      if (data.type === "happy-emotes") {

        // Dynamically create icon component
        const viewContainerRef = this.emotePopupSpace.viewContainerRef;
        for (let index = 0; index < data.value; index++) {
          const componentRef = viewContainerRef.createComponent<EmotePopupIconComponent>(EmotePopupIconComponent);
          componentRef.instance.iconName = "cool";
          timer(3200).subscribe(() => {
            componentRef.destroy();
          })
        }
        
        
      }
    });

    this.botService.getStream("chat-message").subscribe(data => {

      if (data.content.length > 200) return;
      const message: string = data.content;

      // const tokens = message.toUpperCase().split(" ");
      // const coolTokens: string[] = (this.barTypes[this.type] as any).cool.tokens;
      // const uncoolTokens: string[] = (this.barTypes[this.type] as any).uncool.tokens;

      // for (const token of tokens) {
      //   if (coolTokens.includes(token)) {
      //     this.cool++;
      //     break;
      //   }

      //   if (uncoolTokens.includes(token)) {
      //     this.cool--;
      //     break;
      //   }
      // }
    });
  }
}
