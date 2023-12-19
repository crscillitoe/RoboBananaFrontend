import { Component, OnInit } from '@angular/core';
import { BotConnectorService } from '../services/bot-connector.service';

interface Player {
  name: string;
  id: number;
}

interface Piece {
  row: number;
  column: number;
  color: Color;
  falling: boolean;
}

type Color = "red" | "yellow";

const HEIGHT_PER_ROW = 107;

@Component({
  selector: 'app-connect-four',
  templateUrl: './connect-four.component.html',
  styleUrls: ['./connect-four.component.scss']
})
export class ConnectFourComponent implements OnInit {
  
  playerOne: Player = {
    name: "",
    id: -1
  };
  playerTwo: Player = {
    name: "",
    id: -1
  };

  pieces: Piece[] = []
  turn: Color = "red";
  win: Color | undefined;
  acceptingChallenges = false;

  constructor(private botService: BotConnectorService) { }

  ngOnInit(): void {
    this.botService.getStream("connect-four").subscribe(data => {
      if (data.action === "new_game") this.newGame(data.player_one as Player, data.player_two as Player);
      else if (data.action === "move") {
        const color = data.player_id === this.playerOne.id ? "red" : "yellow";
        this.move(color, data.row, data.column);
        if (data.win === true) this.win = color;
        this.turn = color === "yellow" ? "red" : "yellow";
      }
      else if (data.action === "accepting_challenges") {
        this.acceptingChallenges = true;        
        this.resetBoard();
      }
    })
  }

  resetBoard() {
    this.win = undefined;
    this.pieces = [];
    this.turn = "red";
  }

  newGame(playerOne: Player, playerTwo: Player) {
    this.acceptingChallenges = false;
    this.resetBoard();
    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
  }

  move(color: Color, row: number, column: number) {
    const newPiece = {
      color,
      row,
      column,
      falling: true
    };
    this.pieces.push(newPiece);
    setTimeout(() => newPiece.falling = false, 100);
  }

  getTop(row: number) {
    const startTop = 560;
    return `${startTop - (HEIGHT_PER_ROW * row)}px`
  }

  getLeft(column: number) {
    const startLeft = 20;
    return `${startLeft + (HEIGHT_PER_ROW * column)}px`
  }

  getTransform(falling: boolean) {
    const rowDelta = 6;
    const fallHeight = -rowDelta * HEIGHT_PER_ROW;
    const translation = falling ? fallHeight : 0;
    return `translateY(${translation}px)`;
  }
}
