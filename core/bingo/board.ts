import { sum } from "core/array-extensions";

type Match = {
  row: number;
  column: number;
  number: number;
}

export default class Board {
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