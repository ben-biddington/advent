import * as fs from 'fs';
import { expect } from 'chai';
import { lines } from 'core/internal/text';
import BingoGame from 'core/bingo/bingo-game';
import Board from 'core/bingo/board';

type Coordinates = {
  x: number;
  y: number;
}

type LineSegment = {
  start: Coordinates;
  end: Coordinates;
}

const parse = (input: string) : LineSegment[] => {
  const parseCoordinates = (text: string): Coordinates => {
    const [x,y] = text.split(',');
    return { x: parseInt(x), y: parseInt(y) };
  }

  return lines(input).map((startAndEnd: string) => {
    const [start, end] = startAndEnd.split('->');

    return {
      start: parseCoordinates(start),
      end: parseCoordinates(end),
    }
  });
}

describe('--- Day 5: Hydrothermal Venture --- (part one)', () => {
  it(`determine the number of points where at least two lines overlap`, () => {
    const input = `
      0,9 -> 5,9
      8,0 -> 0,8
      9,4 -> 3,4
      2,2 -> 2,1
      7,0 -> 7,4
      6,4 -> 2,0
      0,9 -> 2,9
      3,4 -> 1,4
      0,0 -> 8,8
      5,5 -> 8,2
    `

    const segments = parse(input);

    expect(segments[0]).to.eql(
      {
        start: { x: 0, y: 9 }, end: { x: 5, y: 9 }
      }
    )

    expect(segments[segments.length - 1]).to.eql(
      {
        start: { x: 5, y: 5 }, end: { x: 8, y: 2 }
      }
    )
  });

  it(`Real game`, () => {
  });
});
