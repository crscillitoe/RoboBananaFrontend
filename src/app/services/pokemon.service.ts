import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(private http: HttpClient) { }

  playMove(move: string, amount: number) {
    let frames: number = 1
    switch (move) {
      case "Up":
      case "Down":
      case "Left":
      case "Right":
        frames = 18 * amount; // 18 is the amount of frames it takes to move one space in Emerald
        break
    }

    this.http.post(`http://localhost:5000/mgba-http/button/hold?key=${move}&duration=${frames}`)
      .subscribe(data => {})
  }
}
