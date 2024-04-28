import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(private http: HttpClient) { }


  playMove(move: string, amount: number) {
    let frames: number = 1

    const MULTI_MOVES: string[] = ["Up", "Down", "Left", "Right"]
    if (MULTI_MOVES.includes(move)) {
      frames = 18 * amount // 18 is the number of frames it takes to move one tile in Emerald
    }

    this.http.post(`http://localhost:5000/mgba-http/button/hold?key=${move}&duration=${frames}`, {})
      .subscribe(data => {})
  }
}
