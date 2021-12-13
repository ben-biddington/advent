import { expect } from "chai";
import Path from "core/pathing/path";
import { Segment, Segments } from "core/pathing/segments";
import { lines } from "core/text";
import * as fs from 'fs';

const parse = (input: string) => {
  const paths: Segment[] = lines(input)
    .map(line => {
      const [start, end] = line.split('-');
      return { start, end };
    });
  
  return new Segments(paths);
}

describe('--- Day 13: Transparent Origami --- (part one)', () => {
  it('The given example', () => {
    const input = `
      6,10
      0,14
      9,10
      0,3
      10,4
      4,11
      6,0
      6,12
      4,1
      0,13
      10,12
      3,4
      3,0
      8,4
      1,10
      2,14
      8,10
      9,0
      
      fold along y=7
      fold along x=5
    `;

    const expected = `
      ...#..#..#.
      ....#......
      ...........
      #..........
      ...#....#.#
      ...........
      ...........
      -----------
      ...........
      ...........
      .#....#.##.
      ....#......
      ......#...#
      #..........
      #.#........
    `
  });
});