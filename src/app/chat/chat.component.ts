import { Component, Input, OnInit } from '@angular/core';
import { BotConnectorService } from '../services/bot-connector.service';
import { ActivatedRoute } from '@angular/router';
import { FieldAdapter } from '../dynamic-overlay/field-adapter';
import { TwitchEmotesService } from '../services/twitch-emotes.service';
import { ParseSourceFile } from '@angular/compiler';
import { SystemMessageService } from '../services/system-message.service';
import { ChatChunkType, ChatProcessorService } from '../services/chat-processor.service';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @Input() mainChatOverlay: boolean = false;

  // 0 == All
  // 1 == NA
  // 2 == NOT NA
  @Input() regionCheck: number = 0;

  QUEUE_LENGTH: number = 30;

  splitChat: boolean = false;

  messageContainers: MessageContainer[] = [
    {
      messages: [],
    }
  ];

  // messages: any[] = [];
  vod_reviewee_id?: number;
  previous_message_author_id: number = -1;

  constructor(private chatProcessingService: ChatProcessorService, private botService: BotConnectorService, private route: ActivatedRoute, private twitchEmotesService: TwitchEmotesService, private systemMessageService: SystemMessageService, private pokemonService: PokemonService) { }

  @Input() height?: string | null;
  @Input() width?: string | null;
  @Input() top?: string | null;
  @Input() bottom?: string;
  @Input() left?: string | null;
  @Input() right?: string;
  @Input() borderRadius?: string;
  @Input() messagesMargin?: string;
  @Input() containerPadding?: string;
  @Input() backgroundColor?: string;
  @Input() position?: string | null;

  ngOnInit(): void {
    if (this.mainChatOverlay) this.listenForWatchParty();

    this.botService.getStream("chat-message").subscribe(data => {
      this.processChatStream(data);
    });

    this.systemMessageService.getSystemMessageStream().subscribe(data => {
      this.processChatStream(data);
    });

    // Goes in chat component because the sub-goal component
    // isn't loaded in on the chat only view
    this.botService.getStream("subs").subscribe(data => {
      this.systemMessageService.sendMessage(data.message);
    });

    this.botService.getStream("vod-reviews").subscribe(data => {
      if (data.userid === -1) this.vod_reviewee_id = undefined;
      if (data.userid !== -1) {
        this.vod_reviewee_id = data.userid;
        console.debug(`HIGHLIGHT MESSAGES FROM ${data.userid}`)
      }
    });

    this.route.queryParams.subscribe(params => {
      this.height = params["height"] ?? this.height;
      this.width = params["width"] ?? this.width;
      this.top = params["top"] ?? this.top;
      this.bottom = params["bottom"] ?? this.bottom;
      this.left = params["left"] ?? this.left;
      this.right = params["right"] ?? this.right;
      this.borderRadius = params["borderRadius"] ?? this.borderRadius;
      this.messagesMargin = params["messagesMargin"] ?? this.messagesMargin;
      this.backgroundColor = params["backgroundColor"] ?? this.backgroundColor;
      this.position = params["position"] ?? this.position;
    });
  }

  listenForWatchParty() {
    this.botService.getStream("streamdeck").subscribe(data => {
      if (data.type === "tvt") {
        if (!data.enabled) {
          this.splitChat = false;

          // const team1Messages: any[] = this.messageContainers[0].messages.slice(0, 10);
          // const team2Messages: any[] = this.messageContainers[1].messages.slice(0, 10);

          // // Combine the two arrays into one
          // const bothTeamMessages: any[] = team1Messages.map((item, index) => [item, team2Messages[index]]).flat();

          this.messageContainers = [
            {
              messages: [],
            },
          ];

          return;
        }

        this.splitChat = true;

        this.messageContainers = [
          {
            messages: [],
            teamName: data.team1name,
            teamLogo: data.team1logo,
            backgroundColor: data.team1background,
            barColor: data.team1barColor,
          },
          {
            messages: [],
            teamName: data.team2name,
            teamLogo: data.team2logo,
            backgroundColor: data.team2background,
            barColor: data.team2barColor,
          }
        ];
      }
    });
  }

  processChatStream(data: any) {
    let modified = this.chatProcessingService.processChat(data, this.vod_reviewee_id, this.previous_message_author_id, this.regionCheck);

    const validPokemonMoves = ["A", "B", "Start", "Select", "Right", "Left", "Up", "Down", "R", "L"]
    if (validPokemonMoves.includes(data.content)) {
      this.pokemonService.playMove(data.content);
    }

    // For some reason .gif stickers are NOT available under cdn.discordapp.com/stickers... and only in the media paths. Temporary fix until Discord fixes this.
    if (modified && modified.stickerURL && modified.stickerURL.endsWith(".gif")) {
      modified.stickerURL = (modified.stickerURL as string).replace("cdn.", "media.").replace(".com", ".net");
    }

    this.previous_message_author_id = data.author_id;
    if (modified == undefined) return;

    if (this.splitChat) {
      for (let i = 0; i < this.messageContainers.length; i++) {
        const name: string = modified.displayName;
        if (name.startsWith('' + this.messageContainers[i].teamName! + ' ')) {
          // Remove team name from display name
          modified.displayName = name.substring(this.messageContainers[i].teamName!.length + 1);

          this.messageContainers[i].messages.push(modified);
          if (this.messageContainers[i].messages.length > this.QUEUE_LENGTH) {
            this.messageContainers[i].messages.shift();
          }
          return;
        }
      }
    } else {
      this.messageContainers[0].messages.push(modified);
      if (this.messageContainers[0].messages.length > this.QUEUE_LENGTH) {
        this.messageContainers[0].messages.shift();
      }
    }
  }



  public get ChatChunkType() {
    return ChatChunkType;
  }

}

export type MessageContainer = {
  messages: any[];
  backgroundColor?: string;
  teamName?: string;
  teamLogo?: string;
  barColor?: string;
}
