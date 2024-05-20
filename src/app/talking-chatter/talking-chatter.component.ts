import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BotConnectorService } from '../services/bot-connector.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-talking-chatter',
  templateUrl: './talking-chatter.component.html',
  styleUrls: ['./talking-chatter.component.scss']
})
export class TalkingChatterComponent implements OnInit, OnDestroy {
  @Input() talkerID: string = '';
  @Input() displayName: string = '';
  @Input() voiceID: string = '';
  @Input() avatarNumber: number = -1;

  isTalking: boolean = false;
  currentMessage: string = '';
  CUSTOM_EMOJI_REGEX = /<a?:(\w+):\d{17,19}>?/g;

  ELEVENLABS_KEY: string = "";
  public audio: HTMLAudioElement;

  constructor(private botService: BotConnectorService, private http: HttpClient) {
    this.audio = new Audio();
  }

  ngOnDestroy(): void {
    this.talkerID = '';
    this.currentMessage = '';
    this.isTalking = false;
    this.voiceID = '';
    this.avatarNumber = -1;
  }

  ngOnInit(): void {
    this.ELEVENLABS_KEY = localStorage.getItem("ElevenLabsKey") ?? "";

    this.botService.getStream('chat-message').subscribe(data => {
      if (data.author_id === this.talkerID && this.currentMessage === '') {
        console.log(data.content);

        let message = data.content;
        const customEmoji = [...message.matchAll(this.CUSTOM_EMOJI_REGEX)];
        for (const match of customEmoji) {
          message = message.replace(match[0], match[1]);
        }

        this.currentMessage = message;

        const ttsURL = `https://api.elevenlabs.io/v1/text-to-speech/${this.voiceID}`;

        const headers = {
          accept: 'audio/mpeg',
          'content-type': 'application/json',
          'xi-api-key': this.ELEVENLABS_KEY,
        };

        const model = "eleven_turbo_v2";
        const request = {
          "text": message,
          "model_id": model,
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
                this.currentMessage = '';
              }
            },
            error: (error) => {
              this.isTalking = false;
            }
          });
      }
    });
  }
}
