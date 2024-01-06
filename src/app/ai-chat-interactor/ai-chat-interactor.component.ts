import { Component, OnInit } from '@angular/core';
import { BotConnectorService } from '../services/bot-connector.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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

  pendingMessages: string[] = [];

  talkingImg: string = "";
  waitingImg: string = "";

  name: string = "";
  requireMentionToReply: boolean = true;

  enabled: boolean = false;
  isTalking: boolean = false;
  public audio: HTMLAudioElement;


  constructor(private botService: BotConnectorService, private route: ActivatedRoute, private http: HttpClient) {
    this.audio = new Audio();
  }

  chatLoop() {
    if (this.pendingMessages.length > 0 && !this.isTalking && this.enabled) {
      // Pick random message
      const randomMessage = this.pendingMessages[Math.floor(Math.random() * this.pendingMessages.length)];
      this.pendingMessages = [];

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
            content: randomMessage,
            role: "user"
          }
        ],
        max_tokens: 100
      }, {
        headers: {
          "Authorization": `Bearer ${this.OPEN_AI_KEY}`
        }
      }).subscribe((data: any) => {
        const repsonse = data.choices[0].message.content;
        const tts = randomMessage + " ... " + repsonse;

        // Now we call elevenlabs
        const ttsURL = `https://api.elevenlabs.io/v1/text-to-speech/knrPHWnBmmDHMoiMeP3l`;

        const headers = {
          accept: 'audio/mpeg',
          'content-type': 'application/json',
          'xi-api-key': this.ELEVENLABS_KEY,
        };

        const request = {
          "text": tts,
          "model_id": "eleven_turbo_v2",
          "voice_settings": { //defaults specific to voiceId
            "stability": 0.5,
            "similarity_boost": 0.75,
            "style": 0,
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

              // when the audio ends, set talking to false
              this.audio.onended = () => {
                this.isTalking = false;
              }
            },
            error: (error) => {
              console.error('Error:', error);
            }
          });
      });

    }

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

        this.talkingImg = data.value.talking_image;
        this.waitingImg = data.value.waiting_image;

        this.name = data.value.name;
        this.requireMentionToReply = data.value.require_mention_to_reply;

        this.SYSTEM_PROMPTS = data.value.system_prompts;
        this.USER_PROMPTS = data.value.user_prompts;
      }
    });

    this.botService.getStream("chat-message").subscribe((data) => {
      const message = data.content;

      // Return early if message doesnt contain our name and we require mention to reply
      if (this.requireMentionToReply && !message.toLowerCase().includes(this.name.toLowerCase())) return;

      this.pendingMessages.push(message);
    });
  }
}
