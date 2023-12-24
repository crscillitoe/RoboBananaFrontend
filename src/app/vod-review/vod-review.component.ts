import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {BotConnectorService} from '../services/bot-connector.service';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {COLORS} from "./vod-review.entities";

@Component({
  selector: 'app-vod-review',
  templateUrl: './vod-review.component.html',
  styleUrls: ['./vod-review.component.scss'],
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({'padding-top': '100px'}),
        animate('1s ease-out', style({'padding-top': '0px'}))
      ]),

      transition(':leave',
        animate('1s ease-out', style({'padding-top': '100px'}))
      )
    ])
  ]
})
export class VodReviewComponent implements OnInit {
  colors = COLORS;
  vodState = {
    riotId: 'WOOHOOJIN#COACH',
    username: 'WOOHOOJIN',
    rank: 'Diamond_3_Rank.png',
    background: 'Diamond.png',
    complete: true,
    nameColor: this.colors['Diamond']
  }

  private destroyRef = inject(DestroyRef)

  constructor(private botService: BotConnectorService) {
  }

  ngOnInit(): void {
    this.botService.getStream("vod-reviews").pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(data => {
      this.vodState = data;
      let rankName = data.rank.replace(/[\d_]+/g, '');
    });
  }
}
