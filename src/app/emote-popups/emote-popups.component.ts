import { Component, OnInit, ViewChild } from '@angular/core';
import { EmotePopupIconComponent } from '../emote-popup-icon/emote-popup-icon.component';
import { EmotePopupsDirective } from './emote-popups-directive';
import { timer } from "rxjs";
import { getBaseStreamURL } from '../utility';
import { BotConnectorService } from '../services/bot-connector.service';
import { ChatChunk, ChatChunkType, ChatProcessorService } from "../services/chat-processor.service";

@Component({
  selector: 'app-emote-popups',
  templateUrl: './emote-popups.component.html',
  styleUrls: ['./emote-popups.component.scss']
})
export class EmotePopupsComponent implements OnInit {

  @ViewChild(EmotePopupsDirective, { static: true }) emotePopupSpace!: EmotePopupsDirective;
  static emojiRegex = new RegExp(/\p{Emoji_Presentation}/gu);

  constructor(private botService: BotConnectorService, private chatProcessorService: ChatProcessorService) { }

  ngOnInit(): void {
    this.botService.getStream("streamdeck").subscribe(data => {

      if (data.type === "happy-emotes") {

        const viewContainerRef = this.emotePopupSpace.viewContainerRef;
        // Dynamically create icon component
        for (let index = 0; index < data.value; index++) {
          const componentRef = viewContainerRef.createComponent<EmotePopupIconComponent>(EmotePopupIconComponent);
          componentRef.instance.iconName = "cool";
          timer(5000).subscribe(() => {
            componentRef.destroy();
          })
        }
        
        
      }
    });

    this.botService.getStream("chat-message").subscribe(data => {

      if (data.content.length > 200) return;
      
      const message = this.chatProcessorService.processChat(data, undefined, 0, 0);
      const emotes = message.chatMessage.chunks.filter((e: ChatChunk) => {return e.type === ChatChunkType.IMG});
      
      //block for identifying unicode emojis and rendering up to 4
      let unicodeEmotes = [...message.content.matchAll(EmotePopupsComponent.emojiRegex)];
      unicodeEmotes = unicodeEmotes.slice(0, 4);
      unicodeEmotes.forEach(e => {
        this.createPopupEmote({textContent: e});
      });

      //block for rendering discord emotes
      if (emotes.length > 0) {
        emotes.forEach((emote: ChatChunk) => {
          this.createPopupEmote({imageUrl: emote.content});
        });
      }

      //block for rendering stickers
      if (message.stickerURL !== "") {
        this.createPopupEmote({imageUrl: message.stickerURL});
      }

    });
  }

  createPopupEmote(assets: {imageUrl?: string, textContent?: string}): void {

    const viewContainerRef = this.emotePopupSpace.viewContainerRef;
    const componentRef = viewContainerRef.createComponent<EmotePopupIconComponent>(EmotePopupIconComponent);

    if (assets.imageUrl)
      componentRef.instance.imageAsset = assets.imageUrl;
    else if (assets.textContent)
      componentRef.instance.textAsset = assets.textContent;

    timer(3000).subscribe(() => {
      componentRef.destroy();
    });
  }

}
