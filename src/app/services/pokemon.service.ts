import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const MULTI_MOVES: string[] = ["Up", "Down", "Left", "Right"]
@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(private http: HttpClient) { }

  playMove(move: string, amount: number) {
    let frames: number = 1
    if (MULTI_MOVES.includes(move)) {
      frames = 15 * amount // 15 is the number of frames it takes to move one tile in Emerald
    }

    this.http.post(`http://localhost:5000/mgba-http/button/hold?key=${move}&duration=${frames}`, {})
      .subscribe(data => {})
  }
}
