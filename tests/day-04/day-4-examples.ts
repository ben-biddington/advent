import { expect } from 'chai';
import { lines } from 'core/internal/text';
import * as fs from 'fs';

type Board = {
  rows: number[][] 
}

type Bingo = {
  numbers: number[];
  boards: Board[];
}

const parse = (input: string) : Bingo => {
  const sections = lines(input);

  // @todo: why does `sections[0].split(',').map(parseInt)` make NaNs?

  const boards = [];

  for (let i = 1; i < sections.length; i++) {
    const rows: number[][] = sections.slice(i, i + 5)
      .map(line => line.trim())
      .map(line => line.split(/\s+/).map(it => parseInt(it)));
 
    i += 4;

    boards.push({ rows });
  }

  return { 
    numbers: sections[0].split(',').map(it => parseInt(it)),
    boards: boards
  };
}

describe('--- Day 4: Giant Squid --- (part one)', () => {
  it(`Bingo`, () => {
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
});