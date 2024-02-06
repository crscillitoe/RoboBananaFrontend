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

  complete: boolean = true; // Whether or not to show the Overlay
  active: boolean = false; // Whether or not to continue the loop
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
        } else if (data.name === "stop" && data.value == true) {
          await this.spotifyService.stop();
          this.complete = true;
          this.active = false;
        }
      }
    });
  }

  async nowPlayingLoop() { // Check for currently playing song every LOOP_INTERVAL millis
    if (this.active) {
      await this.loadNowPlaying();
      setTimeout(() => this.nowPlayingLoop(), LOOP_INTERVAL);
    }
  }

  async loadNowPlaying() {
    const nowPlaying: PlaybackState | false = await this.spotifyService.getNowPlaying();
    if (!nowPlaying || !nowPlaying.is_playing) {
      this.complete = true;
      return;
    } else {
      if (nowPlaying.item.type == "track") {
        const item = nowPlaying.item as Track; // Needed because TS complains that we might be working with a "Episode" otherwise

        if (item.is_local) { // If the file is local, assume self-composed - display a (for now placeholder) hoojSheesh
          this.albumCoverURL = "assets/hoojsheesh.png";
        } else {
          const albumArt = item.album.images.pop(); // Getting the last image from this array will give us the 64x64 version, perfect for our overlay
          this.albumCoverURL = albumArt ? albumArt.url : "";
        }

        this.songArtist = item.artists[0].name;
        this.songTitle = item.name;

        this.complete = false;
      } else {
        this.complete = true;
      }
    }
  }

}
