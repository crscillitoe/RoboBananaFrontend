import { Component, Input, OnInit } from '@angular/core';
import { BotConnectorService } from '../services/bot-connector.service';
import { ActivatedRoute } from '@angular/router';
import { FieldAdapter } from '../dynamic-overlay/field-adapter';
import { TwitchEmotesService } from '../services/twitch-emotes.service';
import { ParseSourceFile } from '@angular/compiler';

enum ChatChunkType {
  TEXT = 0,
  IMG = 1,
  MENTION = 2,
}

interface ChatChunk {
  type: ChatChunkType;
  content: string;
}

interface ChatMessage {
  chunks: ChatChunk[];
  textChunkCount: number;
  imgChunkCount: number;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  // 0 == All
  // 1 == NA
  // 2 == NOT NA
  @Input() regionCheck: number = 0;

  QUEUE_LENGTH: number = 30;
  messages: any[] = [];
  vod_reviewee_id?: number;
  previous_message_author_id: number = -1;

  constructor(private botService: BotConnectorService, private route: ActivatedRoute, private twitchEmotesService: TwitchEmotesService) { }

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
    this.botService.getStream("chat-message").subscribe(data => {
      this.processChatStream(data);
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

  processChatStream(data: any) {
    if (this.regionCheck !== 0) {
      if (this.regionCheck === 1 && !data.isNA) return;
      if (this.regionCheck === 2 && data.isNA) return;
    }
    if (data.content.length > 200) {
      return;
    }

    if (data.content.length === 0 && data.stickers.length === 0) {
      return;
    }


    const emojiChatMessage = this.processEmoijs(data.content, data.emojis, data.platform);
    const chatMessage = this.processMentions(emojiChatMessage, data.mentions);
    if (data.author_id === this.vod_reviewee_id) data.highlight = true;
    if (data.author_id !== this.previous_message_author_id) data.renderHeader = true;
    this.previous_message_author_id = data.author_id;

    data.chatMessage = chatMessage;

    this.messages.push(data);
    if (this.messages.length > this.QUEUE_LENGTH) {
      this.messages.shift();
    }
  }

  processEmoijs(messageContent: string, emojiContent: { [key: string]: string }[], platform: "twitch" | "discord"): ChatMessage {
    const chatChunks: ChatChunk[] = [];
    const emojiMap = new Map<string, string>();

    let updatedMessageContent = messageContent;

    if (platform === "twitch") {
      const tokens = messageContent.split(" ");
      for (const token of tokens) {
        if (token === '') continue;
        if (!this.twitchEmotesService.isEmote(token)) continue;

        // Can type def here because we data validated above.
        emojiMap.set(token, this.twitchEmotesService.getURL(token) as string);
      }
    }

    emojiContent.forEach(emoji => {
      const emojiText = emoji["emoji_text"]
      emojiMap.set(emojiText, emoji["emoji_url"])
      // Handle issues of no space before the emoji name
      updatedMessageContent = updatedMessageContent.replaceAll(emojiText, ` ${emojiText} `)
    });

    const splitMessage = updatedMessageContent.split(" ");
    let currentTextChunk = "";
    let imgChunkCount = 0;
    let textChunkCount = 0;
    splitMessage.forEach(wordChunk => {
      if (emojiMap.has(wordChunk)) {
        if (currentTextChunk.trim() !== "") {
          chatChunks.push(
            {
              "type": ChatChunkType.TEXT,
              "content": currentTextChunk.trim()
            }
          );
          currentTextChunk = "";
          textChunkCount++;
        }
        const url = emojiMap.get(wordChunk)!;
        chatChunks.push(
          {
            "type": ChatChunkType.IMG,
            "content": url
          }
        )
        imgChunkCount++;
      } else {
        currentTextChunk += wordChunk + " ";
      }
    })

    if (currentTextChunk.trim() !== "") {
      chatChunks.push(
        {
          "type": ChatChunkType.TEXT,
          "content": currentTextChunk.trim()
        }
      )
      textChunkCount++;
    }
    return {
      chunks: chatChunks,
      imgChunkCount,
      textChunkCount
    }
  }

  processMentions(chatMessage: ChatMessage, mentionContent: { [key: string]: string }[]): ChatMessage {
    const currentChunks = chatMessage.chunks;
    const newChunks: ChatChunk[] = [];
    const mentionMap = new Map<string, string>();

    mentionContent.forEach(mention => {
      const mentionText = mention["mention_text"]
      mentionMap.set(mentionText, mention["display_name"])
      currentChunks.forEach(chunk => {
        if (chunk.type !== ChatChunkType.TEXT) return;
        chunk.content = chunk.content.replaceAll(mentionText, ` ${mentionText} `);
      })
    });

    currentChunks.forEach(chunk => {
      if (chunk.type !== ChatChunkType.TEXT) {
        newChunks.push(chunk);
        return;
      }

      let currentText = "";
      chunk.content.split(" ").forEach(word => {
        if (mentionMap.has(word)) {
          if (currentText.trim() !== "") {
            newChunks.push(
              {
                "type": ChatChunkType.TEXT,
                "content": currentText.trim()
              }
            );
            currentText = "";
          }
          const displayName = mentionMap.get(word)!;
          newChunks.push(
            {
              "type": ChatChunkType.MENTION,
              "content": displayName
            }
          )
        } else {
          currentText += word + " ";
        }
      });
      if (currentText.trim() !== "") {
        newChunks.push(
          {
            "type": ChatChunkType.TEXT,
            "content": currentText.trim()
          }
        )
      }

    })
    return {
      chunks: newChunks,
      imgChunkCount: chatMessage.imgChunkCount,
      textChunkCount: chatMessage.textChunkCount
    }
  }

  public get ChatChunkType() {
    return ChatChunkType;
  }

}
