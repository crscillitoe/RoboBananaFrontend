import { Component, OnInit } from '@angular/core';
import { Chessground } from 'chessground';

@Component({
  selector: 'app-chess',
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.scss']
})
export class ChessComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const config = {
      fen: '2r3k1/pp2Qpbp/4b1p1/3p4/3n1PP1/2N4P/Pq6/R2K1B1R w -',
    };

    const board = document.getElementById('board')!;
    const ground = Chessground(board, config as any);
    console.log(ground.getFen());
  }

}
