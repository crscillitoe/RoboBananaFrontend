import { Component, OnInit } from '@angular/core';
import { Chess, Move } from 'chess.js';
import { BotConnectorService } from '../services/bot-connector.service';
import { ChessBoardInstance, Chessboard, MARKER_TYPE } from 'cm-chessboard-ts';

@Component({
  selector: 'app-chess',
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.scss']
})
export class ChessComponent implements OnInit {
  turnNumber: number = 0;
  naPlayer: string = "";
  euPlayer: string = "";
  naMove: string = "";
  euMove: string = "";
  playing: boolean = false;
  naScore: number = 0;
  euScore: number = 0;
  chessBoard!: ChessBoardInstance;
  chess!: Chess;

  constructor(private botService: BotConnectorService) { }

  getBackgroundColor(parity: number) {
    if ((this.turnNumber + parity) % 2 === 0) {
      return "#FFFFFF";
    }

    return "#FFE400";
  }

  isTurn(parity: number ) {
    return (this.turnNumber + parity) % 2 === 0;
  }

  getDisplay() {
    if (this.playing) {
      return "0";
    }

    return "-2000";
  }

  reset () {
    this.turnNumber = 0;
    this.chess.reset();
    this.chessBoard.setPosition(this.chess.fen());
    this.naMove = "";
    this.euMove = "";
    this.naPlayer = "";
    this.euPlayer = "";
  }

  processMove(moveString: string) {
    const move = this.chess.move(moveString);
    this.chessBoard.setPosition(this.chess.fen(), true);
    this.chessBoard.removeMarkers(MARKER_TYPE.square);
    this.chessBoard.addMarker(MARKER_TYPE.square, move.from);
    this.chessBoard.addMarker(MARKER_TYPE.square, move.to);
  }

  ngOnInit(): void {
    this.chess = new Chess();
    const boardDOM = document.getElementById('board')!;
    this.chessBoard = new Chessboard(boardDOM, {
      "animationDuration": 300
    });
    this.chessBoard.setPosition(this.chess.fen());

    let naScore = localStorage.getItem("naScore");
    if (naScore) {
      this.naScore = parseInt(naScore);
    } else {
      localStorage.setItem("naScore", "0");
    }

    let euScore = localStorage.getItem("euScore");
    if (euScore) {
      this.euScore = parseInt(euScore);
    } else {
      localStorage.setItem("euScore", "0");
    }

    this.botService.getStream("chess").subscribe(data => {
      if (data.open === 1) {
        this.playing = true;
        this.reset();

        if (data.naScore !== -1) {
          this.naScore = data.naScore;
        }

        if (data.euScore !== -1) {
          this.euScore = data.euScore;
        }
      } else {
        this.playing = false;
        this.reset();
      }
    });

    this.botService.getStream("chat-message").subscribe(data => {
      if (!this.playing) return;
      if ((this.turnNumber % 2 == 0 && !data.isNA) || (this.turnNumber % 2 == 1 && data.isNA)) {
        try {
          this.processMove(data.content);
          this.turnNumber++;

          if (data.isNA) {
            this.naPlayer = data.displayName;
            this.naMove = data.content;
          } else {
            this.euPlayer = data.displayName;
            this.euMove = data.content;
          }

          if (this.chess.isCheckmate()) {
            if (this.turnNumber % 2 == 0) {
              this.naScore++;
              localStorage.setItem("naScore", "" + this.naScore);
            } else {
              this.euScore++;
              localStorage.setItem("euScore", "" + this.euScore);
            }

            setTimeout(() => {
              this.reset();
            }, 5000);
          } if (this.chess.isStalemate()) {
            setTimeout(() => {
              this.reset();
            }, 5000);
          }
        } catch (e) {
        }
      }
    });
  }

}
