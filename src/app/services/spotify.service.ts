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
    this.sdk = SpotifyApi.prototype;
    if (this.sdk.getAccessToken !== null) {
      this.isAuthenticated == true;
    }
  }

  async getNowPlaying() {
    if (this.isAuthenticated) {
      return this.sdk.player.getCurrentlyPlayingTrack();
    }
    return "AuthError";
  }

  async login() {
    this.sdk = SpotifyApi.withUserAuthorization(environment.spotifyClientID, environment.spotifyRedirectURL, ["user-read-currently-playing"]);
    const { authenticated } = await this.sdk.authenticate();

    if (!authenticated) {
      console.log("Error authenticating with Spotify");
    } else {
      console.log("Spotify Auth Successful");
      this.isAuthenticated = true;
    }
  }

  async logoff() {
    this.isAuthenticated = false;
  }

  getAuthStatus() {
    return this.isAuthenticated;
  }

}
