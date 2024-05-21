import { Injectable } from '@angular/core';
import { TwitchEmotesService } from './twitch-emotes.service';

export enum ChatChunkType {
  TEXT = 0,
  IMG = 1,
  MENTION = 2,
}

export interface ChatChunk {
  type: ChatChunkType;
  content: string;
}

export interface ChatMessage {
  chunks: ChatChunk[];
  textChunkCount: number;
  imgChunkCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChatProcessorService {
  CUSTOM_EMOJI_REGEX = /<a?:(\w+):\d{17,19}>?/g;

  DEFAULT_MAX_LENGTH = 200;
  ROLE_AND_USER_OVERRIDE: Map<number, number> = new Map([
    [1226317841272279131, 300], // Staffdev
    [932028793093247006, 400], // Mod
    [1040337265790042172, 400], // Hidden Mod
    [1237760496191537176, 400], // Hooj's Accountant
    [204343692960464896, 9999], // Ethan
  ]);

  VALID_IMAGE_ENDINGS = [".png", ".apng", ".jpg", ".jpeg", ".gif", ".webp"];

  constructor(private twitchEmotesService: TwitchEmotesService) { }


  processChat(data: any, vod_reviewee_id: number | undefined, previous_message_author_id: number, regionCheck: number): any {
    let modified = data;
    if (regionCheck !== 0) {
      if (regionCheck === 1 && !data.isNA) return;
      if (regionCheck === 2 && data.isNA) return;
    }

    let emojiFixedContent = data.content;
    const customEmoji = [...emojiFixedContent.matchAll(this.CUSTOM_EMOJI_REGEX)];
    for (const match of customEmoji) {
      emojiFixedContent = emojiFixedContent.replace(match[0], match[1]);
    }

    const checkArray: number[] = (data.roles as Array<{ id: number }>).map(role => role.id);
    if (data.platform === "discord") {
      checkArray.unshift(data.author_id);
    }
    let maxLen = this.checkUserLengthOverride(checkArray);
    if (emojiFixedContent.length > maxLen) {
      return;
    }

    if (emojiFixedContent.length === 0 && data.stickers.length === 0) {
      return;
    }

    if (data.is6Month) {
      // Check if data.content is a valid image URL
      // Using regex to check if the string is a valid URL
      const urlRegex = /^(https?:\/\/[^\s]+)$/;
      if (urlRegex.test(data.content)) {
        if (this.VALID_IMAGE_ENDINGS.some(ending => data.content.endsWith(ending))) {
          data.stickerURL = data.content;
          data.content = "";
        }
      }
    }


    const emojiChatMessage = this.processEmoijs(data.content, data.emojis, data.platform);
    const chatMessage = this.processMentions(emojiChatMessage, data.mentions);
    if (data.author_id === vod_reviewee_id) data.highlight = true;
    if (data.author_id !== previous_message_author_id) data.renderHeader = true;

    modified.chatMessage = chatMessage;

    return modified;
  }

  processEmoijs(messageContent: string, emojiContent: { [key: string]: string }[], platform: "twitch" | "discord"): ChatMessage {
    const chatChunks: ChatChunk[] = [];
    const emojiMap = new Map<string, string>();

    let updatedMessageContent = messageContent;

    const tokens = messageContent.split(" ");
    for (const token of tokens) {
      if (token === '') continue;
      if (!this.twitchEmotesService.isEmote(token)) continue;

      // Can type def here because we data validated above.
      emojiMap.set(token, this.twitchEmotesService.getURL(token) as string);
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

  checkUserLengthOverride(checkIds: number[]): number {
    for (const checkId of checkIds) {
      if (this.ROLE_AND_USER_OVERRIDE.has(checkId)) {
        return this.ROLE_AND_USER_OVERRIDE.get(checkId)!;
      }
    }
    return this.DEFAULT_MAX_LENGTH;
  }

}
