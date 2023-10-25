import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TwitchEmotesService {
  emotes: Map<string, string> = new Map<string, string>();

  constructor(private httpClient: HttpClient) {
    const emoteSetIDs: string[] = [
      // Woohoojin's Emotes
      "63038d56dd2e5e55608ef981",

      // Global 7tv Emotes
      "global"
    ]

    for (const emoteSetID of emoteSetIDs) {
      this.httpClient.get(`https://7tv.io/v3/emote-sets/${emoteSetID}`)
        .subscribe((data: any) => {
          for (const emote of data.emotes) {
            const url = `https://cdn.7tv.app/emote/${emote.id}/4x.webp`;
            const name = emote.name;
            this.emotes.set(name, url);
          }
        });
    }
  }

  public isEmote(token: string): boolean {
    return this.emotes.has(token);
  }

  public getURL(token: string) {
    return this.emotes.get(token);
  }
}
