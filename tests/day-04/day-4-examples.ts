import { expect } from 'chai';
import { sum } from 'core/array-extensions';
import { lines } from 'core/internal/text';
import * as fs from 'fs';

type Match = {
  row: number;
  column: number;
  number: number;
}

class Board {
  public rows: number[][] = [];
  public matches: Match[] = []
  private readonly size: number = 5;
  private readonly label: string = '';
  public lastWinningNumber: number = 0;

  constructor(rows: number[][], label: string) {
    this.rows = rows;
    this.label = label;
  }

  play(number: number) {
    const hasWonAlready = this.hasWon();

    this.rows.forEach((row, index) => {
      if (row.includes(number)) {
        this.matches.push({
          number,
          row: index,
          column: row.indexOf(number)
        })
      }
    });

    if (false == hasWonAlready && this.hasWon()) {
      this.lastWinningNumber = number;
    }
  }

  clear() {
    this.matches = [];
  }

  hasWon(): boolean {
    return this.winningRows().length > 0 || this.winningColumns().length > 0;
  }

  sumOfUnmarkedNumbers() : number {
    const markedNumbers = this.matches.map(it => it.number);

    const allNumbers = this.rows.flat();

    return sum(allNumbers.filter(it => false == markedNumbers.includes(it)));
  }

  private winningRows() {
    const winningRowIndices: number[] = [];

    for (let index = 0; index < this.size; index++) {
      if (this.matches.filter(it => it.row === index).length == this.size) {
        winningRowIndices.push(index);
      }
    }

    return winningRowIndices.map(it => this.rows[it]);
  }

  private winningColumns() {
    const winningColumnIndices: number[] = [];

    for (let index = 0; index < this.size; index++) {
      if (this.matches.filter(it => it.column === index).length == this.size) {
        winningColumnIndices.push(index);
      }
    }

    return winningColumnIndices.map(columnIndex => {
      return this.rows.map(row => {
        return row[columnIndex];
      });
    });
  }
}

class BingoGame {
  private index: number = 0;
  public numbers: number[] = [];
  public boards: Board[] = [];

  get lastCalledNumber() {
    return this.numbers[this.index];
  }

  constructor(numbers: number[], boards: Board[]) {
    this.numbers = numbers;
    this.boards = boards;
  }

  play(count = 1) {
    for (let i = 0; i < count; i++) {
      const number = this.numbers[this.index++];

      this.boards.forEach(board => board.play(number))
    }
  }

  playUntilFirstWin(): Board[] {
    return this.playUntil(winners => winners.length > 0);
  }

  playToEnd(): Board[] {
    return this.playUntil(winners => winners.length === this.boards.length);
  }

  private playUntil(block: (winners: Board[]) => boolean): Board[] {
    const winners: number[] = [];

    for (this.index = 0; this.index < this.numbers.length; this.index++) {
      const number = this.numbers[this.index];

      this.boards.forEach((board, index) => {
        board.play(number);

        if (board.hasWon() && false == winners.includes(index)) {
          winners.push(index)
        }
      });

      if (block(winners.map(i => this.boards[i])))
        break;
    }

    return winners.map(i => this.boards[i]);
  }

  reset() {
    this.index = 0;
    this.boards.forEach(board => board.clear());
  }
}

const parse = (input: string) : BingoGame => {
  const sections = lines(input);

  // @todo: why does `sections[0].split(',').map(parseInt)` make NaNs?

  const boards: Board[] = [];

  for (let i = 1; i < sections.length; i++) {
    const rows: number[][] = sections.slice(i, i + 5)
      .map(line => line.trim())
      .map(line => line.split(/\s+/).map(it => parseInt(it)));
 
    i += 4;

    boards.push(new Board(rows, `board-${boards.length + 1}`));
  }

  return new BingoGame(
    sections[0].split(',').map(it => parseInt(it)), 
    boards
  );
}

describe('--- Day 4: Giant Squid --- (part one)', () => {
  it(`Parsing bingo boards`, () => {
    const raw = `
      7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

      22 13 17 11  0
      8  2 23  4 24
      21  9 14 16  7
      6 10  3 18  5
      1 12 20 15 19
      
      3 15  0  2 22
      9 18 13 17  5
      19  8  7 25 23
      20 11 10 24  4
      14 21 16 12  6
      
      14 21 17 24  4
      10 16 15  9 19
      18  8 23 26 20
      22 11 13  6  5
      2  0 12  3  7
    `

    const game = parse(raw);

    expect(game.numbers.join(',')).to.eql('7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1');
    expect(game.boards.length).to.eql(3);

    expect(game.boards[0].rows[0]).to.eql([22, 13, 17, 11, 0]);
    expect(game.boards[2].rows[4]).to.eql([2,  0, 12,  3,  7]);
  });

  it(`Playing bingo`, () => {
    const raw = `
      7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

      22 13 17 11  0
      8  2 23  4 24
      21  9 14 16  7
      6 10  3 18  5
      1 12 20 15 19
      
      3 15  0  2 22
      9 18 13 17  5
      19  8  7 25 23
      20 11 10 24  4
      14 21 16 12  6
      
      14 21 17 24  4
      10 16 15  9 19
      18  8 23 26 20
      22 11 13  6  5
      2  0 12  3  7
    `

    const game = parse(raw);

    game.play(5);

    expect(game.boards[2].rows.length).to.eql(5);

    expect(game.boards[0].matches.length).to.eql(5);

    expect(game.boards[0].matches).to.eql([
      {
        number: 7,
        row: 2,
        column: 4
      },
      {
        number: 4,
        row: 1,
        column: 3
      },
      {
        number: 9,
        row: 2,
        column: 1
      },
      {
        number: 5,
        row: 3,
        column: 4
      },
      {
        number: 11,
        row: 0,
        column: 3
      },
    ]);

    game.reset();
    
    const winningBoards = game.playUntilFirstWin();

    expect(winningBoards.length).to.eql(1);
    expect(game.lastCalledNumber).to.eql(24);

    expect(winningBoards[0].sumOfUnmarkedNumbers()).to.eql(188);

    expect(winningBoards[0].sumOfUnmarkedNumbers() * game.lastCalledNumber).to.eql(4512);
  });

  it(`Real game`, () => {
    const raw = fs.readFileSync('./input/four/input').toString(); 

    const game = parse(raw);

    const winningBoards = game.playUntilFirstWin();

    expect(winningBoards[0].sumOfUnmarkedNumbers() * game.lastCalledNumber).to.eql(2745);
  });
});

describe('--- Day 4: Giant Squid --- (part two)', () => {
  it(`Which board wins last`, () => {
    const raw = `
      7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

      22 13 17 11  0
      8  2 23  4 24
      21  9 14 16  7
      6 10  3 18  5
      1 12 20 15 19
      
      3 15  0  2 22
      9 18 13 17  5
      19  8  7 25 23
      20 11 10 24  4
      14 21 16 12  6
      
      14 21 17 24  4
      10 16 15  9 19
      18  8 23 26 20
      22 11 13  6  5
      2  0 12  3  7
    `

    const game = parse(raw);

    const winningBoards = game.playToEnd();

    const lastBoardToWin = winningBoards[winningBoards.length - 1];
    
    expect(lastBoardToWin.sumOfUnmarkedNumbers()).to.eql(148);
    expect(lastBoardToWin.sumOfUnmarkedNumbers() * lastBoardToWin.lastWinningNumber).to.eql(1924);
  });

  it(`Real game, which board wins last`, () => {
    const raw = fs.readFileSync('./input/four/input').toString(); 

    const game = parse(raw);

    const winningBoards = game.playToEnd();

    const lastBoardToWin = winningBoards[winningBoards.length - 1];

    expect(lastBoardToWin.sumOfUnmarkedNumbers()).to.eql(314);
    expect(lastBoardToWin.sumOfUnmarkedNumbers() * lastBoardToWin.lastWinningNumber).to.eql(6594);
  });
});