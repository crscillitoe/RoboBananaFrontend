import { Component, OnInit } from '@angular/core';
import mGBA, { mGBAEmulator } from './mgba.js';
import { BotConnectorService } from '../services/bot-connector.service';

@Component({
  selector: 'app-gameboy-advance',
  templateUrl: './gameboy-advance.component.html',
  styleUrls: ['./gameboy-advance.component.scss']
})
export class GameboyAdvanceComponent implements OnInit {
  playing: boolean = false;

  // Defaults to cover minimap
  width: number = 395;
  height: number = 261;
  top: number = 63;
  left: number = 294;

  unpressTiming: number = 135;

  saveGame(module: mGBAEmulator) {
    module.saveState(0);
    const data = module.FS.readFile('/data/states/PokemonEmerald.ss0');
    localStorage.setItem('saveState', "[" + data.toString() + "]");
  }

  pressKey(module: mGBAEmulator, keyName: "a" | "b" | "select" | "start" | "up" | "down" | "left" | "right" | "r" | "l") {
    module.buttonPress(keyName);
    setTimeout(() => {
      module.buttonUnpress(keyName);
    }, this.unpressTiming);
  }

  constructor(private botService: BotConnectorService) {}

  async ngOnInit(): Promise<void> {
    let canvas_id = 'screen'
    const Module = {
      canvas: document.getElementById(canvas_id) as HTMLCanvasElement
    };

    (Module as any)["locateFile"] = ()  => {
      return 'assets/mgba.wasm';
    }

    // Define a variable of type File that references the pokemon emerald rom found in assets/PokemonEmerald.gba
    const pokemonROM = await fetch('assets/PokemonEmerald.gba')
    const pokemonBLOB = await pokemonROM.blob();
    const romBuffer = await pokemonBLOB.arrayBuffer();
    const gbaModule = await mGBA(Module);

    const saveFile = await fetch('assets/PokemonEmerald.ss0');
    const saveBLOB = await saveFile.blob();
    const saveBuffer = await saveBLOB.arrayBuffer();

    gbaModule.FSInit().then(() => {
       gbaModule.FS.writeFile('PokemonEmerald.gba', new Uint8Array(romBuffer));
       if (localStorage.getItem('saveState')) {
        gbaModule.FS.writeFile('/data/states/PokemonEmerald.ss0', new Uint8Array(JSON.parse(localStorage.getItem('saveState')!)));
       } else {
        gbaModule.FS.writeFile('/data/states/PokemonEmerald.ss0', new Uint8Array(saveBuffer));
       }

       gbaModule.loadGame('PokemonEmerald.gba');
       gbaModule.loadState(0);

       gbaModule.setVolume(0);

       // No idea what mode 0 does, but 15 is clearly the number of ms between frames
       // 1000/60 is roughly 16.666666666666668, so 15 is close enough
       gbaModule.setMainLoopTiming(0, 15);

       this.botService.getStream("streamdeck").subscribe(data => {
         if (data.type === 'pokemon-move' && this.playing) {
           this.pressKey(gbaModule, data.move.toLowerCase());
         } else if (data.type === 'pokemon-mod') {
          if (data.value === 'save') {
            this.saveGame(gbaModule);
          } else if (data.value === 'off') {
            this.saveGame(gbaModule);
            this.playing = false;
          } else if (data.value === 'on') {
            this.playing = true;
          } else if (data.value === 'load') {
            gbaModule.loadState(0);
          } else if (data.value === 'size') {
            this.width = data.width;
            this.height = data.height;
            this.top = data.top;
            this.left = data.left;
          } else if (data.value === "debug-unpress") {
            this.unpressTiming = data.timing;
          }
         }
       });
     }
    );
  }
}
