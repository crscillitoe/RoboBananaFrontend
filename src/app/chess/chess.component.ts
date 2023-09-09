import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Chess, Color, Move } from 'chess.js';
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
  naScore: number = 0;
  euScore: number = 0;
  chessBoard!: ChessBoardInstance;
  chess!: Chess;
  stockfish!: Worker;
  evaluation: number = 0.0;

  @Input() makeMove!: EventEmitter<any>;
  @Input() resetEvent!: EventEmitter<void>;
  @Output() gameOver = new EventEmitter<string>();

  constructor(private botService: BotConnectorService) { }

  getBackgroundColor(parity: number) {
    if ((this.turnNumber + parity) % 2 === 0) {
      return "#FFFFFF";
    }

    return "#FFE400";
  }

  isTurn(parity: number) {
    return (this.turnNumber + parity) % 2 === 0;
  }

  reset() {
    this.turnNumber = 0;
    this.chess.reset();
    this.chessBoard.setPosition(this.chess.fen());
    this.chessBoard.removeMarkers(MARKER_TYPE.square);
    this.evaluation = 0;
    this.naPlayer = "";
    this.euPlayer = "";
  }

  processMove(moveString: string) {
    const move = this.chess.move(moveString);
    this.turnNumber++;
    this.stockfish.postMessage(`position fen ${this.chess.fen()}`);
    this.stockfish.postMessage('eval');
    this.chessBoard.setPosition(this.chess.fen(), true);
    this.chessBoard.removeMarkers(MARKER_TYPE.square);
    this.chessBoard.addMarker(MARKER_TYPE.square, move.from);
    this.chessBoard.addMarker(MARKER_TYPE.square, move.to);
  }

  getMostRecentMove(color: Color) {
    const currentTurn = this.chess.turn();

    let move = "";
    if (currentTurn !== color) {
      move = this.chess.history()[this.chess.history().length - 1];
    } else {
      move = this.chess.history()[this.chess.history().length - 2];
    }

    if (move == undefined) return "";
    return move;
  }

  testMoves(moves: string[]) {
    setTimeout(() => {
      const move = moves.shift()!;
      this.processMove(move);

      if (moves.length > 0) {
        this.testMoves(moves);
      }
    }, 1000);
  }

  evalWhite() {
    if (this.evaluation > 10) return 100;
    if (this.evaluation < -10) return -100;

    const adjusted = Math.abs(this.evaluation + 10);
    const percentage = adjusted * 5;
    if (percentage > 100) return 100;
    return percentage;
  }

  ngOnInit(): void {
    this.stockfish = new Worker('/assets/stockfish.js');
    this.stockfish.postMessage('uci');
    this.stockfish.onmessage = ({ data }) => {
      if (data.includes("(white side)")) {
        const evaluation: string = data;
        const cut1 = evaluation.replace("Total evaluation: ", "");
        const cut2 = cut1.replace("(white side)", "");
        const finalEval = parseFloat(cut2);
        this.evaluation = finalEval;
      }
    };


    this.chess = new Chess();
    const boardDOM = document.getElementById('board')!;
    this.chessBoard = new Chessboard(boardDOM, {
      "animationDuration": 300
    });

    this.chessBoard.setPosition(this.chess.fen());
    this.resetEvent.subscribe(_ => this.reset());

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

    this.makeMove.subscribe((event) => this.moveHandler(event));
  }

  moveHandler(data: any) {
    if ((this.turnNumber % 2 == 0 && !data.isNA) || (this.turnNumber % 2 == 1 && data.isNA)) {
      try {
        this.processMove(data.content);

        if (data.isNA) {
          this.naPlayer = data.displayName;
        } else {
          this.euPlayer = data.displayName;
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
  }

}
