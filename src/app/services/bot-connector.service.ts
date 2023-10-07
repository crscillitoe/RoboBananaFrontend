import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { getBaseStreamURL } from '../utility';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BotConnectorService {
  streams: Map<StreamName, ReplaySubject<any>> = new Map<StreamName, ReplaySubject<any>>();
  preProcessors: Map<StreamName, ((data: any) => any)[]> = new Map<StreamName, ((data: any) => any)[]>();

  constructor() {
    // Initialize all of our subscribables
    for (const streamName of StreamNames) {
      this.streams.set(streamName, new ReplaySubject<any>(1));
      this.preProcessors.set(streamName, []);
    }

    this.definePreProcessors();

    // Setup event listeners for every defined event type
    const streamURL = getBaseStreamURL() + "?channel=events";
    const source = new EventSource(streamURL);
    for (let streamName of this.streams.keys()) {
      source.addEventListener(streamName, (e: MessageEvent) => {
        const json = JSON.parse(e.data);
        let data = json;

        for (const preProcessor of this.preProcessors.get(streamName)!) {
          data = preProcessor(data);
        }

        console.debug(streamName, data);
        this.streams.get(streamName)!.next(data);
      });
    }

    // Keepalive
    source.addEventListener('keepalive', (e: MessageEvent) => {
    });
  }

  definePreProcessors() {
    const chatProcessors = [
      // Reverse roles, they come in reverse priority order
      (data: any) => {
        data.roles.reverse();
        return data;
      },

      // Detect NA Role
      (data: any) => {
        data["isNA"] = false;

        const NA = environment.naDiscordRoleID;
        for (let role of data.roles) {
          if (role.id == NA) {
            data["isNA"] = true;
            break
          }
        }

        return data;
      },

      // Set Sticker URL
      (data: any) => {
        data["stickerURL"] = "";
        if (data.stickers.length > 0) {
          data["stickerURL"] = data.stickers[0].url;
        }

        return data;
      },

      // Grab badges for user's roles prioritizing rank badges
      (data: any) => {
        data["badges"] = []
        let rankBadgeUrl = "";
        for (let role of data.roles) {
          if (role.icon != null) {
            // Identify rank badge for a given user
            const roleName: string = role.name;
            const potentialRankName = roleName.split(" ")[0];
            if (RankNames.has(potentialRankName)) {
              rankBadgeUrl = role.icon;
              continue;
            }

            // Only push non-rank badges to the badges list for now
            data["badges"].push(role.icon);
          }
        }

        // Prioritize rank badges above all other badges
        if (rankBadgeUrl) data["badges"].unshift(rankBadgeUrl)
        data["badges"] = data["badges"].slice(0, 3)

        return data;
      },

      // Set Author Color
      (data: any) => {
        data["authorColor"] = "rgb(255, 255, 255)"
        for (let role of data.roles) {
          if (role.colorR != 0 || role.colorG != 0 || role.colorB != 0) {
            data["authorColor"] = `rgb(${role.colorR}, ${role.colorG}, ${role.colorB})`;
            break;
          }
        }

        return data;
      }
    ]

    this.preProcessors.set("chat-message", chatProcessors);
  }

  /**
   * Returns a subscribable stream that yields all data from the given eventstream.
   */
  getStream(name: StreamName): ReplaySubject<any> {
    return this.streams.get(name)!;
  }
}

const RankNames = new Set(["Radiant", "Immortal", "Ascendant", "Diamond", "Platinum", "Gold", "Silver", "Bronze", "Iron"]);

export const StreamNames = ["predictions", "subs", "subs-count",
  "poll-answers", "polls", "cool",
  "vod-reviews", "timer", "tamagachi", "chat-message", "chess", "dynamic-overlay"] as const;

export type StreamName = typeof StreamNames[number];