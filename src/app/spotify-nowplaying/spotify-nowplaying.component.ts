import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { SpotifyService } from '../services/spotify.service';
import { BotConnectorService } from '../services/bot-connector.service';
import { PlaybackState, Track } from '@spotify/web-api-ts-sdk';

const LOOP_INTERVAL = 5 * 1000; // 5 seconds

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
  songProgressPercent: string = "50%";

  ngOnInit(): void {
    this.botService.getStream("streamdeck").subscribe(async data => {
      if (data.type === "spotify") {
        if (data.name === "login" && data.value == true) {
          await this.spotifyService.login();
          this.active = true;
          this.nowPlayingLoop();
          this.progressLoop();
        } else if (data.name === "stop" && data.value == true) {
          await this.spotifyService.stop();
          this.playing = false;
          this.active = false;
        }
      }
    });

    this.botService.getStream("vod-reviews").subscribe(data => {
      this.vodReviewActive = !data.complete;
    });
  }

  // Check for currently playing song every LOOP_INTERVAL millis
  async nowPlayingLoop() {
    if (this.active) {
      await this.loadNowPlaying();
      setTimeout(() => this.nowPlayingLoop(), LOOP_INTERVAL);
    }
  }

  async progressLoop() {
    if (this.active) {
      await this.updateProgress();
      setTimeout(() => this.progressLoop(), 1000);
    }
  }

  async loadNowPlaying() {
    if (this.vodReviewActive) {
      this.playing = false;
      return;
    }

    const nowPlaying: PlaybackState | false = await this.spotifyService.getNowPlaying();
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
        this.songTitle = item.name;
        this.songDuration = item.duration_ms;

        this.songEndTime = Date.now() + (item.duration_ms - nowPlaying.progress_ms);

        this.playing = true;
      } else {
        this.playing = false;
      }
    }
  }

  async updateProgress() {
    const progress = this.songEndTime - Date.now();
    this.songProgressPercent = `${Math.floor(100 - ((progress / this.songDuration) * 100))}%`;
  }

}
