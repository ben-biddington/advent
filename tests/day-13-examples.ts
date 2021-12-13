import { expect } from "chai";
import Path from "core/pathing/path";
import { Segment, Segments } from "core/pathing/segments";
import { lines } from "core/text";
import { isThisISOWeek } from "date-fns";
import * as fs from 'fs';

class Origami {
  private input: string[] = [];

  constructor(input: string[]) {
    this.input = input;
  }

  get count() {
    return this.input.length;
  }
}

type Instructions = {
  lines: string[];
}

const indexOf = (lines: string[], match: (line: string) => boolean) => {
  let index = -1;

  lines.forEach((line, i) => {
    if (match(line)) {
      index = i;
    }
  });

  return index;
}

const parse = (input: string): [Origami, Instructions] => {
  const l = lines(input.trim(), { allowBlank: true });

  const indexOfBlankLine = indexOf(l, line => line.trim().length === 0);

  return [new Origami(l.slice(0, indexOfBlankLine)), { lines: l.slice(indexOfBlankLine + 1) }];
}

describe('--- Day 13: Transparent Origami --- (part one)', () => {
  it('Parsing', () => {
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

    const [origami, instructions] = parse(input);

    expect(origami.count).to.eql(18);
    expect(instructions.lines.length).to.eql(2);

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