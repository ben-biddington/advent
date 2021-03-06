import { expect } from "chai";
import { parse as parseOrigami, Origami, Instructions, Fold } from "core/origami/origami";
import { lines } from "core/text";
import * as fs from 'fs';

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

  const parseFold = (line: string) : Fold => {
    const match = line.match(/(?<axis>[y|x])=(?<value>\d+)$/);
    
    if (!match)
      throw new Error(`Failed to parse line <${line}> as fold`);
    
    //@ts-ignore
    return { axis: match?.groups['axis'] , value: parseInt(match?.groups['value']) };
  }

  const origami = parseOrigami(l.slice(0, indexOfBlankLine));
  const folds   = l.slice(indexOfBlankLine + 1).map(parseFold); 

  origami.apply(folds.slice(0, 1));

  return [ origami, { folds }];
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
    expect(instructions.folds).to.eql([
      { 
        axis: 'y',
        value: 7
      },
      { 
        axis: 'x',
        value: 5
      },
    ])

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

    expect(origami.toString()).to.eql(expected.trim());
  });

  it('Folding', () => {
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

    const folded = origami.fold(instructions.folds[0]);

    expect(folded.count).to.eql(17);

    const expected=`
#.##..#..#.
#...#......
......#...#
#...#......
.#.#..#.###
...........
...........`;

    expect(folded.toString()).to.eql(expected.trim());

    const secondFold = folded.fold(instructions.folds[1]);

    expect(secondFold.toString()).to.eql(`
#####
#...#
#...#
#...#
#####
.....
.....
    `.trim());
  });

  it('The real example', () => {
    const input = fs.readFileSync('./input/thirteen').toString();

    const [origami, instructions] = parse(input);

    const folded = origami.fold(instructions.folds[0]);

    expect(folded.count).to.eql(678);
  });

  it('The real example (2)', () => {
    const input = fs.readFileSync('./input/thirteen').toString();

    const [origami, instructions] = parse(input);

    let folded = origami;

    for (let index = 0; index < instructions.folds.length; index++) {
      folded = folded.fold(instructions.folds[index]);
    }

    expect(folded.toString()).to.eql(`
####..##..####.#..#.#....#..#.####.####.
#....#..#.#....#..#.#....#..#....#.#....
###..#....###..####.#....####...#..###..
#....#....#....#..#.#....#..#..#...#....
#....#..#.#....#..#.#....#..#.#....#....
####..##..#....#..#.####.#..#.####.#....
`.trim());
  });
});