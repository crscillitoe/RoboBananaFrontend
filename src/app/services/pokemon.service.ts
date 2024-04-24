import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(private http: HttpClient) { }

  playMove(move: string) {
    this.http.post(`http://localhost:5000/mgba-http/button/tap?key=${move}`, {})
      .subscribe(data => {})
  }
}
