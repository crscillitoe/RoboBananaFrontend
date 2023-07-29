import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { getBaseStreamURL } from '../utility';

@Injectable({
  providedIn: 'root'
})
export class BotConnectorService {
  streams: Map<StreamName, ReplaySubject<any>> = new Map<StreamName, ReplaySubject<any>>();

  constructor() {
    // Initialize all of our subscribables
    for (const streamName of StreamNames) {
      this.streams.set(streamName, new ReplaySubject<any>(1));
    }

    // Setup event listeners for every defined event type
    const streamURL = getBaseStreamURL() + "?channel=events";
    const source = new EventSource(streamURL);
    for (let streamName of this.streams.keys()) {
      console.log(streamName);
      source.addEventListener(streamName, (e: MessageEvent) => {
        console.log(streamName, e);
        this.streams.get(streamName)!.next(JSON.parse(e.data));
      });
    }

    // Keepalive
    source.addEventListener('keepalive', (e: MessageEvent) => {
      console.log(e);
    });
  }

  /**
   * Returns a subscribable stream that yields all data from the given eventstream.
   */
  getStream(name: StreamName): ReplaySubject<any> {
    return this.streams.get(name)!;
  }
}

export const StreamNames = ["predictions", "subs", "subs-count",
                                      "poll-answers", "polls", "cool",
                                      "vod-reviews", "timer", "tamagachi", "chat-message", "chat-test-message"] as const;

export type StreamName = typeof StreamNames[number];