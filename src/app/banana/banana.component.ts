import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as vad from 'voice-activity-detection';


@Component({
  selector: 'app-banana',
  templateUrl: './banana.component.html',
  styleUrls: ['./banana.component.scss'],
  animations: [
    trigger('wiggle', [
      state('talk', style({transform: 'translateX(0)'})),
      state('idle', style({transform: 'translateX(-100%)'})),
      transition('talk => idle', animate('1s linear')),
      transition('idle => talk', animate('1s linear'))
    ])
  ]
})
export class BananaComponent implements OnInit {
  /**
   * REMINDER FOR ANY OTHER USERS OF THIS FEATURE -
   *  OBS MUST BE STARTED WITH THE '--enable-media-stream' FLAG
   *  TO SUPPORT MEDIA STREAMS.
   *
   *  https://obsproject.com/forum/threads/browser-source-doesnt-allow-microphone-consent-dialogs.80260/
   */
  speaking: boolean = false;
  timeout: NodeJS.Timeout = setTimeout(() => {});

  quiet: number = 0;

  state: string = 'idle';
  ngOnInit() {
    const debounce = (func: Function, delay: number) => {
      let debounceTimer: NodeJS.Timeout;
      return () => {
          const args = arguments
              clearTimeout(debounceTimer)
                  debounceTimer
              = setTimeout(() => func.apply(this, args), delay)
      }
    }

    navigator.mediaDevices.getUserMedia({
        audio: {
          autoGainControl: false,
          echoCancellation: false,
          noiseSuppression: false,
      }
    }).then(stream => {
      const audioContext = new AudioContext({latencyHint: 0});

      const v = vad(audioContext, stream, {
        minNoiseLevel: 0.1,
        minCaptureFreq: 0,
        maxCaptureFreq: 255,
        fftSize: 256,
        bufferLen: 256,
        smoothingTimeConstant: 0,
        onUpdate: (val) => {
          console.log(val);
          if (val > 0.1) {
            this.speaking = true;
            this.state = 'talk';
            this.cdr.detectChanges();
            this.quiet = 0;
          } else {
            this.quiet++;
            if (this.quiet > 3) {
              this.speaking = false;
              this.state = 'idle';
              this.cdr.detectChanges();
            }
          }
        },
      });
    });

  }

  constructor(private cdr: ChangeDetectorRef) {}
}
