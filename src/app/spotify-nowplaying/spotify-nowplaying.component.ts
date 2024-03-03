import { Component, HostBinding, OnInit } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { SpotifyService } from '../services/spotify.service';
import { BotConnectorService } from '../services/bot-connector.service';
import { PlaybackState, Track } from '@spotify/web-api-ts-sdk';

const SONG_UPDATE_LOOP_INTERVAL: number = 5 * 1000; // 5 seconds
// Nested Timer Throttling limits us to 1 second anyways, anything lower won't work here.
const PROGRESS_UPDATE_LOOP_INTERVAL: number = 1 * 1000; // 1 second

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify-nowplaying.component.html',
  styleUrls: ['./spotify-nowplaying.component.scss'],
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({ 'padding-top': '100px' }),
        animate('1s ease-out', style({ 'padding-top': '0px' }))
      ]),

      transition(':leave',
        animate('1s ease-out', style({ 'padding-top': '100px' }))
      )
    ])
  ]
})
export class SpotifyComponent implements OnInit {

  constructor(private botService: BotConnectorService, private spotifyService: SpotifyService) {
  }

  playing: boolean = false; // Whether or not to show the Overlay
  active: boolean = false; // Whether or not to continue the loop
  vodReviewActive: boolean = false;
  albumCoverURL: string = "";
  songTitle: string = "";
  songArtist: string = "";
  songDuration: number = 0;
  songEndTime: number = 0;

  songArtistFontSize = "14px";
  songProgressPercent: string = "0%";
  songNameElement: Element | null = null;
  songNameContainerElement: Element | null = null;
  // This variable is only needed because we can't yet fetch the above on the very first pass
  elementsReady: boolean = false;

  ngOnInit(): void {
    this.botService.getStream("streamdeck").subscribe(async data => {
      if (data.type === "spotify") {
        if (data.name === "login" && data.value == true) {
          const success = await this.spotifyService.login();
          if (success == true) {
            this.active = true;
            this.nowPlayingLoop();
            this.progressLoop();
          }
        } else if (data.name === "stop" && data.value == true) {
          await this.spotifyService.stop();
          this.playing = false;
          this.active = false;
        }
      }
    });

    this.botService.getStream("vod-reviews").subscribe(data => {
      // If a VOD Review is set as "complete", we're no longer blocked
      if (data.complete === true) {
        this.vodReviewActive = false;
      } else { // Else block rendering
        this.playing = false;
        this.vodReviewActive = true;
      }
    });
  }

  // Check for currently playing song every LOOP_INTERVAL millis
  async nowPlayingLoop() {
    if (this.active) {
      await this.loadNowPlaying();
      setTimeout(() => this.nowPlayingLoop(), SONG_UPDATE_LOOP_INTERVAL);
    }
  }

  async progressLoop() {
    if (this.active) {
      await this.updateProgress();
      setTimeout(() => this.progressLoop(), PROGRESS_UPDATE_LOOP_INTERVAL);
    }
  }

  async loadNowPlaying() {
    if (this.vodReviewActive) {
      this.playing = false;
      return;
    }

    let nowPlaying: false | PlaybackState = false;
    try {
      nowPlaying = await this.spotifyService.getNowPlaying();
    } catch (e) {
      // In case we get an error we should gracefully print it to the console for debugging for now
      console.log(e);
      return;
    }

    if (!nowPlaying || !nowPlaying.is_playing) {
      this.playing = false;
      return;
    } else {
      if (nowPlaying.item.type == "track") {
        // Needed because TS complains that we might be working with a "Episode" otherwise
        const item = nowPlaying.item as Track;
        // If the file is local, assume self-composed - display a (for now placeholder) hoojSheesh
        if (item.is_local) {
          this.albumCoverURL = "assets/hoojsheesh.png";
        } else {
          // Getting the last image from this array will give us the 64x64 version, perfect for our overlay
          const albumArt = item.album.images.pop(); 
          this.albumCoverURL = albumArt ? albumArt.url : "";
        }

        this.songArtist = item.artists[0].name;
        if (this.songArtist == "") this.songArtist = "Woohoojin"; // Assume selfcomposed if no artist
        this.setArtistDisplayProperties();

        this.songTitle = item.name;
        if (this.elementsReady) this.updateTextScroll();

        this.songDuration = item.duration_ms;
        this.songEndTime = Date.now() + (item.duration_ms - nowPlaying.progress_ms);

        this.playing = true;
      } else {
        this.playing = false;
      }
    }
  }

  updateTextScroll() {
    if (this.elementsReady == false) {
      this.songNameContainerElement = document.querySelector("#spotify-songNameContainer")!;
      this.songNameElement = document.querySelector("#spotify-songName")!;
      this.elementsReady = true;
    }

    if (this.songNameContainerElement!.clientWidth < this.songNameElement!.clientWidth) {
      this.songNameElement!.classList.add("animate");
    } else {
      this.songNameElement!.classList.remove("animate");
    }

  }

  setArtistDisplayProperties() {
    const artistLength = this.songArtist.length;
    if (artistLength < 14) {
      this.songArtistFontSize = "18px";
    } else if (artistLength > 28) { // Anything longer then "StreamBeats by Harris Heller"
      this.songArtist = this.songArtist.slice(0, 28) + "..";
      this.songArtistFontSize = "14px";
    } else {
      this.songArtistFontSize = "14px";
    }
  }

  async updateProgress() {
    if (!this.playing) return;
    const progress = this.songEndTime - Date.now();
    let calc = Math.floor(100 - ((progress / this.songDuration) * 100));
    // Clamp the width to within 0 and 100 to prevent the bar from over/underflowing
    if (calc < 0) {
      calc = 0;
    } else if (calc > 100) {
      calc = 100;
     }
    this.songProgressPercent = `${calc}%`;
    this.updateTextScroll();
  }

}
