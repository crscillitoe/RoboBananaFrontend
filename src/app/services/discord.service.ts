import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getBaseStreamURL } from '../utility';

@Injectable({
  providedIn: 'root'
})
export class DiscordService {
  private accessToken: string = "";
  private streamChatId: string = "1037040541017309225";

  constructor(private http: HttpClient) { }

  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  sendMessage(message: string) {
    const url = "https://overlay.woohooj.in/publish-overlay-message";
    this.http.post(url, {
      token: this.accessToken,
      message: message
    }, {

    }).subscribe();
  }
}
