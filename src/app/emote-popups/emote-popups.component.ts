import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { EmotePopupIconComponent } from '../emote-popup-icon/emote-popup-icon.component';
import { EmotePopupsDirective } from './emote-popups-directive';
import { timer } from "rxjs";
import { BotConnectorService } from '../services/bot-connector.service';
import { ChatChunk, ChatChunkType, ChatProcessorService } from "../services/chat-processor.service";

@Component({
  selector: 'app-emote-popups',
  templateUrl: './emote-popups.component.html',
  styleUrls: ['./emote-popups.component.scss']
})
export class EmotePopupsComponent implements OnInit {

  public static isTesting: boolean = false;

  static emojiRegex = new RegExp(/\p{Emoji_Presentation}/gu);
  constructor(private botService: BotConnectorService, private chatProcessorService: ChatProcessorService) { }

  @ViewChild(EmotePopupsDirective, { static: true }) emotePopupSpace!: EmotePopupsDirective;

  // This component is rendered 4 times, once for each direction
  @Input() name?: string;

  @Input() direction: "up" | "down" | "left" | "right" = "up";

  // Whether chat messages should currently trigger emote jumps
  protected enabled: boolean = false;

  // Jump duration in ms
  protected duration: number = 1500;

  // the size of an emote blip in px (square) //a size of 40 or smaller is recommended
  protected size: number = 40;
  ngOnInit(): void {

    this.botService.getStream("streamdeck").subscribe(data => {

      if (data.type === "happy-emotes" && (data.location === this.name || data.location === "all")) {

        if (data.enabled != null) {
          this.enabled = data.enabled;
        }

        if (data.duration != null) {
          this.duration = data.duration;
        }

        if (data.emoteSize != null) {
          this.size = data.emoteSize;
        }

        if (data.amount != null) {
          for (let index = 0; index < data.amount; index++) {
            this.createPopupEmote({imageUrl: "assets/cool.webp"});
          }
        }
      }
    });

    this.botService.getStream("chat-message").subscribe(data => {
      if (!this.enabled)  return;
      if (data.content.length > 200) return;

      // creates a default emote from each message if we are in test mode
      // done so fake messages trigger emotes to display
      if (EmotePopupsComponent.isTesting) this.createPopupEmote({imageUrl: "assets/cool.webp"});

      const message = this.chatProcessorService.processChat(data, undefined, 0, 0);
      const emotes = message.chatMessage.chunks.filter((e: ChatChunk) => {return e.type === ChatChunkType.IMG});

      // block for identifying unicode emojis and rendering up to 4
      let unicodeEmotes = [...message.content.matchAll(EmotePopupsComponent.emojiRegex)];
      unicodeEmotes = unicodeEmotes.slice(0, 4);
      unicodeEmotes.forEach(e => {
        this.createPopupEmote({textContent: e});
      });

      // block for rendering discord emotes
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

    componentRef.instance.direction = this.direction;
    componentRef.instance.size = this.size;
    componentRef.instance.duration = this.duration;
    timer(this.duration).subscribe(() => {
      componentRef.destroy();
    });
  }
}
