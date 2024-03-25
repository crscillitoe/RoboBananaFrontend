import { Component, HostBinding, OnInit } from '@angular/core';
import { BotConnectorService } from '../services/bot-connector.service';
import { InhouseTrackerService } from '../services/inhouse-tracker.service';
import { getBaseStreamURL } from '../utility';

@Component({
  selector: 'app-inhouse-tracker',
  templateUrl: './inhouse-tracker.component.html',
  styleUrls: ['./inhouse-tracker.component.scss'],
  animations: []
})
export class InhouseTrackerComponent implements OnInit {

  activelyTracking: boolean = false;
  currentTrackId: string | null = null;
  match: any = null;
  teamLeft: any = null;
  teamRight: any = null;

  constructor(private botService: BotConnectorService, private inhouseTrackerService: InhouseTrackerService) {
  }

  async ngOnInit(): Promise<void> {
    this.match = null;
    this.botService.getStream("streamdeck").subscribe(async data => {
      if (data.type === "inhouse-tracker") {
        if (data.name === "trackState" && data.value == true) {
          if (data.id) {
            this.currentTrackId = data.id;
            this.activelyTracking = true;
          }
        } else if (data.name === "trackState" && data.value == false) {
          this.resetTracker();
          this.activelyTracking = false;
        }
      }
    });

    const streamURL = getBaseStreamURL() + "?channel=inhouse-tracker-channel";
    const source = new EventSource(streamURL);

    source.addEventListener("inhouse-tracker-data", (e: MessageEvent) => {
      this.updateMatch(JSON.parse(e.data));
      this.activelyTracking = true;
    })
  }

  updateMatch(data: any) {
    this.match = data;
    this.teamLeft = this.match.teams[0];
    this.teamRight = this.match.teams[1];
  }

  resetTracker() {
    if (!this.activelyTracking) return;
    this.currentTrackId = null;
  }
}
