import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  sdk: SpotifyApi;
  isAuthenticated: boolean = false;

  constructor() {
    this.sdk = SpotifyApi.withUserAuthorization(environment.spotifyClientID, environment.spotifyRedirectURL, ["user-read-currently-playing"]);
    if (this.sdk.getAccessToken !== null) { // If we have an access token already, don't go through login flow again
      this.isAuthenticated == true;
    }
  }

  async getNowPlaying() {
    if (this.isAuthenticated) {
      return this.sdk.player.getCurrentlyPlayingTrack();
    }
    return false;
  }

  async login() {
    const { authenticated } = await this.sdk.authenticate();

    if (!authenticated) {
      console.log("Error authenticating with Spotify");
    } else {
      console.log("Spotify Auth successful");
      this.isAuthenticated = true;
    }
  }

  async stop() {
    this.isAuthenticated = false;
  }

  getAuthStatus() {
    return this.isAuthenticated;
  }

}
