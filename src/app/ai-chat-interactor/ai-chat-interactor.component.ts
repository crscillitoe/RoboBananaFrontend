import { Component, OnInit } from '@angular/core';
import { BotConnectorService } from '../services/bot-connector.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChatProcessorService } from '../services/chat-processor.service';

interface PendingMessage {
  message: string;

  // Used to render full message data on screen
  processedMessage: any;
}

@Component({
  selector: 'app-ai-chat-interactor',
  templateUrl: './ai-chat-interactor.component.html',
  styleUrls: ['./ai-chat-interactor.component.scss']
})
export class AiChatInteractorComponent implements OnInit {
  SYSTEM_PROMPTS = [];
  USER_PROMPTS = [];

  OPEN_AI_KEY: string = "";
  ELEVENLABS_KEY: string = "";

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
        model: "gpt-3.5-turbo",
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

    }

    // Just in case, let's avoid memory leaks
    if (this.pendingMessages.length > 100) this.pendingMessages = [];

    setTimeout(() => {
      this.chatLoop();
    }, 1000);
  }

  ngOnInit(): void {
    this.chatLoop();

    this.route.queryParams.subscribe((params) => {
      // print keys of params
      for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
          const element = params[key];
          localStorage.setItem(key, element);
        }
      }
    });

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
      }
    });

    this.botService.getStream("chat-message").subscribe((data) => {
      let messageToBot = "";
      const message = data.content;
      const processed = this.chatProcessingService.processChat(data, -1, -1, 0);

      // Just slap this bad boy on there
      if (this.testing) {
        this.pendingMessages.push({
          message: message,
          processedMessage: processed
        });
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
