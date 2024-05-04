import { Component, ComponentRef, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { EmotePopupIconComponent } from '../emote-popup-icon/emote-popup-icon.component';
import { EmotePopupsDirective } from './emote-popups-directive';
import { timer } from "rxjs";
import { BotConnectorService } from '../services/bot-connector.service';
import { ChatChunk, ChatChunkType, ChatProcessorService } from "../services/chat-processor.service";
import { PhysicsInfo } from '../emote-popup-icon/physical/emote-popup-icon-physical.component';

@Component({
  selector: 'app-emote-popups',
  templateUrl: './emote-popups.component.html',
  styleUrls: ['./emote-popups.component.scss']
})
export class EmotePopupsComponent implements OnInit {

  public static isTesting: boolean = false;
  protected static shouldActivateOnStartup(name?: string) {
    return name == "bottomEdgeMultiple" || name == "special";
  }

  static emojiRegex = new RegExp(/\p{Emoji_Presentation}/gu);
  constructor(private botService: BotConnectorService, private chatProcessorService: ChatProcessorService, private element: ElementRef) {
    this.defaultEmoteProperties = new EmoteProperties();
  }

  @ViewChild(EmotePopupsDirective, { static: true }) emotePopupSpace!: EmotePopupsDirective;

  // This component is rendered 4 times, once for each direction
  @Input() name?: string;

  @Input() direction: "up" | "down" | "left" | "right" = "up";

  // Whether chat messages should currently trigger emote jumps
  protected enabled: boolean = false;

  protected defaultEmoteProperties: EmoteProperties;

  ngOnInit(): void {
    this.enabled = EmotePopupsComponent.shouldActivateOnStartup(this.name);

    this.botService.getStream("streamdeck").subscribe(data => {
      if (data.type === "happy-emotes") {
        if (data.location === this.name || data.location === "all") {
          this.onStreamdeckData(data);
        }
      }
    });

    this.botService.getStream("chat-message").subscribe(data => {
      this.onChatMessage(data);
    });
  }

  onStreamdeckData(data: any) {
    if (data.enabled != null) {
      this.enabled = data.enabled;
    }

    if (data.duration != null) {
      this.defaultEmoteProperties.duration = data.duration;
    }

    if (data.emoteSize != null) {
      this.defaultEmoteProperties.size = data.emoteSize;
    }

    if (data.amount != null) {
      for (let index = 0; index < data.amount; index++) {
        this.createPopupEmote(structuredClone(this.defaultEmoteProperties));
      }
    }
  }

  onChatMessage(data: any) {
    if (!this.enabled)  return;
    if (data.content.length > 200) return;

    var emoteProperties = structuredClone(this.defaultEmoteProperties);

    // creates a default emote from each message if we are in test mode
    // done so fake messages trigger emotes to display
    // if (EmotePopupsComponent.isTesting) this.createPopupEmote(structuredClone(emoteProperties));

    const message = this.chatProcessorService.processChat(data, undefined, 0, 0);
    const emotes = message.chatMessage.chunks.filter((e: ChatChunk) => {return e.type === ChatChunkType.IMG});
    emoteProperties.chatData = message;

    // block for identifying unicode emojis and rendering up to 4
    let unicodeEmotes = [...message.content.matchAll(EmotePopupsComponent.emojiRegex)];
    unicodeEmotes = unicodeEmotes.slice(0, 4);
    unicodeEmotes.forEach(e => {
      emoteProperties.asset = e.toString();
      emoteProperties.type = "text";
      this.createPopupEmote(emoteProperties);
    });

    // block for rendering discord emotes
    if (emotes.length > 0) {
      emotes.forEach((emote: ChatChunk) => {
        emoteProperties.asset = emote.content;
        emoteProperties.type = "img";
        this.createPopupEmote(emoteProperties);
      });
    }

    //block for rendering stickers
    if (message.stickerURL !== "") {
      emoteProperties.asset = message.stickerURL;
      emoteProperties.type = "img";
      this.createPopupEmote(emoteProperties);
    }
  }

  createPopupEmote(properties: EmoteProperties): void {
    let props = structuredClone(properties);
    if (this.filterEmotes(props)) {
      this.adjustEmoteProperties(props);
      this._createPopupEmoteContainer(props);
    }
  }

  _createPopupEmoteContainer(properties: EmoteProperties): ComponentRef<EmotePopupIconComponent> | null {
    if (properties.amount <= 0) return null;  //recursion exit

    const componentRef = this._getPopupEmoteContainerRef();

    properties.containerWidth = this.element.nativeElement.offsetWidth;
    properties.containerHeight = this.element.nativeElement.offsetHeight;

    componentRef.instance.properties = properties;
    
    componentRef.instance.closeObservable.subscribe((remove: boolean) => {
      if (remove) componentRef.destroy();
    });

    //recursion entry
    properties.amount--;
    timer(properties.consecutiveDelay).subscribe(() => {
      this._createPopupEmoteContainer(properties);
    });
    return componentRef;
  }

  _getPopupEmoteContainerRef(): ComponentRef<any> {
    const viewContainerRef = this.emotePopupSpace.viewContainerRef;
    return viewContainerRef.createComponent<EmotePopupIconComponent>(EmotePopupIconComponent);
  }

  //return true when emote should be displayed
  filterEmotes(properties: EmoteProperties): boolean {
    return true;
  }

  adjustEmoteProperties(properties: EmoteProperties): void {}

}

export class EmoteProperties {
  //default values can be set here
  asset: string = "assets/cool.webp";
  type: "img" | "text" = "img";
  size = 80;
  duration = 1500;
  amount = 1;
  consecutiveDelay = 200;
  chatData?: any;
  bounces: number = 0;
  containerWidth: number = 0;
  containerHeight: number = 0;
  initialPhysicsState: PhysicsInfo = new PhysicsInfo();
}