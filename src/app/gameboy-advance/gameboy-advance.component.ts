import { Component, OnInit } from '@angular/core';
import mGBA from './mgba.js';

@Component({
  selector: 'app-gameboy-advance',
  templateUrl: './gameboy-advance.component.html',
  styleUrls: ['./gameboy-advance.component.scss']
})
export class GameboyAdvanceComponent implements OnInit {
  ngOnInit(): void {
    let canvas_id = 'screen'
    const Module = {
      canvas: document.getElementById(canvas_id) as HTMLCanvasElement
    };

    (Module as any)["locateFile"] = ()  => {
      return 'assets/mgba.wasm';
    }

    // Define a variable of type File that references the pokemon emerald rom found in assets/PokemonEmerald.gba
    fetch('assets/PokemonEmerald.gba').then(response => {
      console.log(response);
      response.blob().then(blob => {
        blob.arrayBuffer().then(romBuffer => {
          mGBA(Module).then(function (Module) {
          	const mGBAVersion =
          		Module.version.projectName +
          		' ' +
          		Module.version.projectVersion;

              console.log(mGBAVersion);

          	  Module.FSInit().then(() => {
                Module.FS.writeFile('PokemonEmerald.gba', new Uint8Array(romBuffer));
                Module.loadGame('PokemonEmerald.gba');

                for (let i = 0; i < 10; i++) {
                  // wait 1 second
                  setTimeout(() => {
                    console.log('pressing start');
                    Module.buttonPress('start');
                    Module.buttonUnpress('start');
                  }, 1000 * i);
                }
              }
            );
          });
        });
      });
    });

  }
}
