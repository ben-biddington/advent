import Board from "core/bingo/board";

export default class BingoGame {
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