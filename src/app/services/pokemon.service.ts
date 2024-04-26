import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(private http: HttpClient) { }

  playMove(move: string, amount: number) {
    let moves: string[] = []
    for (let i = 0; i < amount; i++) {
      moves.push(move)
    }

    this.http.post(`http://localhost:5000/mgba-http/button/tapmany?key=${moves.join(",")}`, {})
      .subscribe(data => {})
  }
}
