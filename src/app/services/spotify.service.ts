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
    // If we have an access token already, don't go through login flow again
    if (this.sdk.getAccessToken !== null) {
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
      this.isAuthenticated = false;
      return false;
    } else {

      if ((await this.testAllowed()) == false) {
        console.log("User is not allowed to auth with this app");
        this.isAuthenticated = false;
        return false;
      } else {
        console.log("Spotify Auth successful");
        this.isAuthenticated = true;
        return true;
      }
      
    }
  }

  async stop() {
    this.isAuthenticated = false;
  }

  getAuthStatus() {
    return this.isAuthenticated;
  }

  async getAccessTokenStatus() {
    const token = await this.sdk.getAccessToken();
    return token ? true : false;
  }

  async testAllowed() {
    try {
      const profile = await this.sdk.currentUser.profile();
    } catch {
      return false;
    }
    return true;
  }

}
