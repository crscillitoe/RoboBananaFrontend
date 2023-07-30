import { Component, OnInit } from '@angular/core';
import { BotConnectorService } from '../services/bot-connector.service';

enum ChatChunkType {
  TEXT = 0,
  IMG = 1
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

  QUEUE_LENGTH: number = 25;
  messages: any[] = [];

  constructor(private botService: BotConnectorService) { }

  ngOnInit(): void {
    this.botService.getStream("chat-message").subscribe(data => {
      if (data.content.length > 200) {
        return;
      }

      if (data.content.legnth === 0 && data.stickers.length === 0) {
        return;
      }

      if (data.displayName.length > 12) {
        data.displayName = data.displayName.slice(0, 11);
      }

      if (data.stickers.length > 0) {
        data["stickerURL"] = data.stickers[0].url;
      } else {
        data["stickerURL"] = "";
      }

      data["badgeURL"] = "";
      data["authorColor"] = "rgb(255, 255, 255)"
      data.roles.reverse();
      for (let role of data.roles) {
        if (role.icon != null) {
          data["badgeURL"] = role.icon;
          break;
        }
      }

      for (let role of data.roles) {
        if (role.colorR != 0 || role.colorG != 0 || role.colorB != 0) {
          data["authorColor"] = `rgb(${role.colorR}, ${role.colorG}, ${role.colorB})`;
          break;
        }
      }

      const chatMessage = this.processEmoijs(data.content, data.emojis)

      data.chatMessage = chatMessage;

      this.messages.push(data);
      if (this.messages.length > this.QUEUE_LENGTH) {
        this.messages.shift();
      }
    });

  }

  processEmoijs(messageContent: string, emojiContent: { [key: string]: string }[]): ChatMessage {
    const chatChunks: ChatChunk[] = [];
    const emojiMap = new Map<string, string>();

    let updatedMessageContent = messageContent;

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

  public get ChatChunkType() {
    return ChatChunkType;
  }

}
