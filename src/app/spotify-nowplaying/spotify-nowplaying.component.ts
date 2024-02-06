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

  complete: boolean = true;
  active: boolean = false;
  albumCoverURL: string = "";
  songTitle: string = "";
  songArtist: string = "";

  ngOnInit(): void {
    this.botService.getStream("streamdeck").subscribe(async data => {
      if (data.type === "spotify") {
        if (data.name === "login" && data.value == true) {
          await this.spotifyService.login();
          this.active = true;
          this.nowPlayingLoop();
        } else if (data.name === "logoff" && data.value == true) {
          await this.spotifyService.logoff();
          this.active = false;
          this.complete = true;
        }
      }
    });
  }

  async nowPlayingLoop() {
    if (this.active) {
      await this.loadNowPlaying();
      setTimeout(() => this.nowPlayingLoop(), LOOP_INTERVAL);
    }
  }

  async loadNowPlaying() {
    const nowPlaying: PlaybackState | "AuthError" = await this.spotifyService.getNowPlaying();
    if (nowPlaying == "AuthError") {
      this.complete = true;
      return;
    } else {
      if (nowPlaying.item.type == "track") {
        const item = nowPlaying.item as Track;

        const albumArt = item.album.images.pop();
        this.albumCoverURL = albumArt ? albumArt.url : "assets/hoojsheesh.png"; // Assume self-composed for local files, which will return no album art

        this.songArtist = item.artists[0].name;
        this.songTitle = item.name;

        this.complete = false;
      } else {
        this.complete = true;
      }
    }
  }

}
