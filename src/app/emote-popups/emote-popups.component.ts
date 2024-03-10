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

  //isTesting is being set from the testing.component when that is being initialized
  public static isTesting: boolean = false;
  static emojiRegex = new RegExp(/\p{Emoji_Presentation}/gu);


  constructor(private botService: BotConnectorService, private chatProcessorService: ChatProcessorService) { }

  @ViewChild(EmotePopupsDirective, { static: true }) emotePopupSpace!: EmotePopupsDirective;
  @Input() name?: string; //for future shenanigans with multiple emote zones
  @Input() direction: string = "up"; //the direction in which the emotes should jump // up || down || left || right

  protected enabled: boolean = false; //whether chat messages should currently trigger emote jumps
  protected duration: number = 1500; //jump duration in ms
  protected size: number = 40; //the size of an emote blip in px (square) //a size of 40 or smaller is recommended

  ngOnInit(): void {

    this.botService.getStream("streamdeck").subscribe(data => {

      if (data.type === "happy-emotes" && (data.name === this.name || data.name === "all")) {
        
        if (data.value != null) {
          this.enabled = data.value;
        }
        if (data.enabled != null) {
          this.enabled = data.enabled;
        }
        if (data.duration != null) {
          this.duration = data.duration;
        }
        if (data.size != null) {
          this.size = data.size;
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
      
      //creates a default emote from each message if we are in test mode
      //done so fake messages trigger emotes to display
      if (EmotePopupsComponent.isTesting) this.createPopupEmote({imageUrl: "assets/cool.webp"});
      
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

    componentRef.instance.direction = this.direction;
    componentRef.instance.size = this.size;
    componentRef.instance.duration = this.duration;
    timer(this.duration).subscribe(() => {
      componentRef.destroy();
    });
  }

}
