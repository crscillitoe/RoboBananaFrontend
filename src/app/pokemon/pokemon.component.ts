import { Component, OnInit } from '@angular/core';
import { BotConnectorService } from '../services/bot-connector.service';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss']
})
export class PokemonComponent implements OnInit {
  constructor(private botService: BotConnectorService, private pokemonService: PokemonService ) {}

  ngOnInit(): void {
    this.botService.getStream("streamdeck").subscribe(data => {
      if (data.type == "pokemon-move") {
        // data.move (A|B|Start|....)
        // data.userName (Woohoojin)
        // data.number (1-9 inclusive) TODO

        this.pokemonService.playMove(data.move);
      }
    });
  }
}
