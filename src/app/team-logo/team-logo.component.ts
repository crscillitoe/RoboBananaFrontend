import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import { BotConnectorService } from '../services/bot-connector.service';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-team-logo',
  templateUrl: './team-logo.component.html',
  styleUrls: ['./team-logo.component.scss']
})
export class TeamLogoComponent implements OnInit {

  team1name = "";
  team2name = "";

  team1logo = "";
  team2logo = "";

  private readonly _botService = inject(BotConnectorService);
  private readonly _destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this._botService.getStream('streamdeck').pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe(data => {
      if (data.type === "logo") {
        this.team1name = data.team1name;
        this.team2name = data.team2name;

        this.team1logo = data.team1logo;
        this.team2logo = data.team2logo;
      } else if (data.type === "logo_swap") {
        // Swap existing team1 and team2 data
        const tempTeam1name = this.team1name;
        const tempTeam1logo = this.team1logo;

        this.team1name = this.team2name;
        this.team1logo = this.team2logo;

        this.team2name = tempTeam1name;
        this.team2logo = tempTeam1logo;
      }
    });
  }
}
