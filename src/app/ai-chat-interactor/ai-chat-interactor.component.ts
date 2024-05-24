import { Component, OnInit } from '@angular/core';
import { BotConnectorService } from '../services/bot-connector.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChatProcessorService } from '../services/chat-processor.service';
import { animate, style, transition, trigger } from '@angular/animations';

interface PendingMessage {
  message: string;

  // Used to render full message data on screen
  processedMessage: any;
}

interface PendingTTS {
  message: string;
  senderName: string;
  voiceID: string;
  voiceName: string;
}

@Component({
  selector: 'app-ai-chat-interactor',
  templateUrl: './ai-chat-interactor.component.html',
  styleUrls: ['./ai-chat-interactor.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ 'opacity': '0%' }),
        animate('1s ease-out', style({ 'opacity': '100%' }))
      ]),

      transition(':leave',
        animate('1s ease-out', style({ 'opacity': '0%' }))
      )
    ])
  ]
})
export class AiChatInteractorComponent implements OnInit {
  SYSTEM_PROMPTS = [];
  USER_PROMPTS = [];

  OPEN_AI_KEY: string = "";
  ELEVENLABS_KEY: string = "";
  CUSTOM_EMOJI_REGEX = /<a?:(\w+):\d{17,19}>?/g;

  CHAT_ONLY_TIMEOUT_MS = 0;

  chatOnlyMode: boolean = false;
  chatOnlyLocked: boolean = false;
  chatOnlyRole: number = 0;

  VOICE_ID: string = "";

  pendingMessages: PendingMessage[] = [];

  hiddenTalking: boolean = false;

  talkingImg: string = "";
  waitingImg: string = "";

  style: number = 0;

  name: string = "";
  requireMentionToReply: boolean = true;

  testing: boolean = false;

  enabled: boolean = false;
  isTalking: boolean = false;

  exposeChatterName: boolean = false;
  repeatChatterMessage: boolean = true;
  exposeChatterRank: boolean = false;

  currentMessage: any = null;

  currentTTSMessage: any = null;
  currentTTSVoice: any = "";
  currentTTSInvoker: any = "";

  lastT3TTSMessage: PendingTTS | null = null;

  pendingTTS: PendingTTS[] = [];

  public audio: HTMLAudioElement;


  constructor(private chatProcessingService: ChatProcessorService, private botService: BotConnectorService, private route: ActivatedRoute, private http: HttpClient) {
    this.audio = new Audio();
  }

  chatLoop() {
    if (this.pendingMessages.length > 0 && (this.testing || (!this.isTalking && this.enabled && !this.hiddenTalking))) {
      // Flag to future calls that we are currently processing a message. This will prevent multiple messages from being sent at once
      this.hiddenTalking = true;

      // Pick random message
      const randomMessage = this.pendingMessages[Math.floor(Math.random() * this.pendingMessages.length)];
      this.pendingMessages = [];

      if (this.testing) {
        this.currentMessage = randomMessage.processedMessage;
        setTimeout(() => {
          this.chatLoop();
        }, 1000);

        return;
      }

      this.http.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-4o",
        messages: [
          ...this.SYSTEM_PROMPTS.map((prompt) => {
            return {
              content: prompt,
              role: "system"
            }
          }),
          ...this.USER_PROMPTS.map((prompt) => {
            return {
              content: prompt,
              role: "user"
            }
          }),
          {
            content: randomMessage.message,
            role: "user"
          }
        ],
        max_tokens: 100
      }, {
        headers: {
          "Authorization": `Bearer ${this.OPEN_AI_KEY}`
        }
      }).subscribe((data: any) => {
        const response = data.choices[0].message.content;

        let tts: string = response;
        const removeDelimiter = randomMessage.message.split(" ::: ")[1];

        if (this.repeatChatterMessage) tts = removeDelimiter + "..." + response;

        // Now we call elevenlabs
        const ttsURL = `https://api.elevenlabs.io/v1/text-to-speech/${this.VOICE_ID}`;

        const headers = {
          accept: 'audio/mpeg',
          'content-type': 'application/json',
          'xi-api-key': this.ELEVENLABS_KEY,
        };

        const model = this.style === 0 ? "eleven_turbo_v2" : "eleven_multilingual_v2";

        const request = {
          "text": tts,
          "model_id": model,
          "voice_settings": { //defaults specific to voiceId
            "stability": 0.5,
            "similarity_boost": 0.75,
            "style": this.style,
            "use_speaker_boost": true
          }
        };

        this.http
          .post(ttsURL, request, { headers, responseType: 'arraybuffer' })
          .subscribe({
            next: (response: ArrayBuffer) => {
              const blob = new Blob([response], { type: 'audio/mpeg' });
              const url = URL.createObjectURL(blob);
              this.audio.src = url;
              this.audio.play();

              this.isTalking = true;
              this.currentMessage = randomMessage.processedMessage;

              // when the audio ends, set talking to false
              this.audio.onended = () => {
                this.isTalking = false;
                this.hiddenTalking = false;
                this.currentMessage = null;
              }
            },
            error: (error) => {
              this.isTalking = false;
              this.hiddenTalking = false;
            }
          });
      },
        (error: any) => {
          this.isTalking = false;
          this.hiddenTalking = false;
        }
      );

    } else if (this.pendingTTS.length > 0 && !this.isTalking) {
      this.isTalking = true;
      let pendingMessage: PendingTTS = this.pendingTTS.pop()!;
      let tts: string = `${pendingMessage.senderName} says: ${pendingMessage.message}`;

      // Now we call elevenlabs
      const ttsURL = `https://api.elevenlabs.io/v1/text-to-speech/${pendingMessage.voiceID}`;

      const headers = {
        accept: 'audio/mpeg',
        'content-type': 'application/json',
        'xi-api-key': this.ELEVENLABS_KEY,
      };

      const model = "eleven_multilingual_v2";

      const request = {
        "text": tts,
        "model_id": model,
        "voice_settings": { //defaults specific to voiceId
          "stability": 1.0,
          "similarity_boost": 0.75,
          "style": 0.5,
          "use_speaker_boost": true
        }
      };

      this.http
        .post(ttsURL, request, { headers, responseType: 'arraybuffer' })
        .subscribe({
          next: (response: ArrayBuffer) => {
            const blob = new Blob([response], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
            this.audio.src = url;
            this.audio.play();

            this.lastT3TTSMessage = pendingMessage;
            this.currentTTSMessage = pendingMessage.message;
            this.currentTTSVoice = pendingMessage.voiceName;
            this.currentTTSInvoker = pendingMessage.senderName;

            // when the audio ends, set talking to false
            this.audio.onended = () => {
              this.isTalking = false;
              this.hiddenTalking = false;
              this.currentTTSMessage = null;

              if (this.chatOnlyMode && this.CHAT_ONLY_TIMEOUT_MS > 0) {
                this.chatOnlyLocked = true;
                setTimeout(() => {
                  this.chatOnlyLocked = false;
                }, this.CHAT_ONLY_TIMEOUT_MS)
              }
            }
          },
          error: (error) => {
            this.isTalking = false;
            this.hiddenTalking = false;
          }
        });
    }

    // Just in case, let's avoid memory leaks
    if (this.pendingMessages.length > 100) this.pendingMessages = [];

    setTimeout(() => {
      this.chatLoop();
    }, 1000);
  }

  ngOnInit(): void {
    this.chatLoop();

    this.OPEN_AI_KEY = localStorage.getItem("OpenAIKey") ?? "";
    this.ELEVENLABS_KEY = localStorage.getItem("ElevenLabsKey") ?? "";

    this.botService.getStream("streamdeck").subscribe((data) => {
      if (data.type === "ai") {
        console.log(data);
        this.enabled = data.value.enabled;
        if (!this.enabled) return;

        this.pendingMessages = [];

        this.talkingImg = data.value.talking_image;
        this.waitingImg = data.value.waiting_image;

        this.repeatChatterMessage = data.value.repeat_chatter_message;
        this.exposeChatterName = data.value.expose_chatter_name;
        this.exposeChatterRank = data.value.expose_chatter_rank;

        this.style = data.value.style;

        this.name = data.value.name;
        this.requireMentionToReply = data.value.require_mention_to_reply;

        this.VOICE_ID = data.value.voice_id;
        this.SYSTEM_PROMPTS = data.value.system_prompts;
        this.USER_PROMPTS = data.value.user_prompts;
      } else if (data.type === "tts") {
        this.pendingTTS.push({
          message: data.message,
          senderName: data.sender_nickname,
          voiceID: data.voice_id,
          voiceName: data.voice_name
        });
      } else if (data.type === "repeat-tts") {
        if (this.lastT3TTSMessage != null) {
          this.pendingTTS.push(this.lastT3TTSMessage);
        }
      } else if (data.type === "enable-chat-tts") {
        this.chatOnlyMode = data.value;
        this.CHAT_ONLY_TIMEOUT_MS = typeof data.timeoutMs == "number" ? data.timeoutMs : 0;
        this.chatOnlyRole = data.role;
      }
    });

    this.botService.getStream("chat-message").subscribe((data) => {
      let messageToBot = "";

      let message = data.content;
      const customEmoji = [...message.matchAll(this.CUSTOM_EMOJI_REGEX)];
      for (const match of customEmoji) {
        message = message.replace(match[0], match[1]);
      }

      const processed = this.chatProcessingService.processChat(data, -1, -1, 0);

      // Just slap this bad boy on there
      if (this.testing) {
        this.pendingMessages.push({
          message: message,
          processedMessage: processed
        });
      }

      if (this.chatOnlyMode && data.isT3) {
        if (this.pendingTTS.length === 0 && !this.isTalking && message.toLowerCase().startsWith("hooj") && !this.chatOnlyLocked) {
          if (this.chatOnlyRole != 0 && data.roles.some((role: any) => role.id === this.chatOnlyRole)) return;
          this.pendingTTS.push({
            message: message,
            senderName: data.displayName,
            voiceID: "rCmVtv8cYU60uhlsOo1M",
            voiceName: ""
          });
        }
      }


      // Return early if bot is not enabled
      if (!this.enabled) return;

      // Chatter being annoying, trying to break delimiter parsing
      if (message.includes(":::")) return;

      // No emojis.
      if (message.includes("<")) return;

      // Return early if message doesnt contain our name and we require mention to reply
      if (this.requireMentionToReply && !message.toLowerCase().includes(this.name.toLowerCase())) return;

      if (this.exposeChatterName) {
        if (data.displayName.includes(":::")) return;
        messageToBot += "Name - " + data.displayName;
      }

      if (this.exposeChatterRank) {
        if (data["rankName"] == undefined) return;

        messageToBot += ", Rank - " + data["rankName"];
      }

      // Delimiter we will yoink out before reading message back.
      messageToBot += " ::: ";

      messageToBot += message;
      this.pendingMessages.push({
        message: messageToBot,
        processedMessage: processed
      });
    });
  }
}
