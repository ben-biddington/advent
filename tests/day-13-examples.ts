import { expect } from "chai";
import Matrix, { Size } from "core/matrix";
import { lines } from "core/text";
import * as fs from 'fs';

class Origami {
  private input: string[] = [];
  private matrix: Matrix<string>;
  private size: Size;

  constructor(input: string[]) {
    this.input = input;

    const points = input
      .map(it => it.split(','))
      .map(it => [ parseInt(it[0]), parseInt(it[1]) ]);
    
    const largestX = points.map(it => it[0]).sort((a,b) => b - a)[0];
    const largestY = points.map(it => it[1]).sort((a,b) => b - a)[0];

    this.size = { columns: largestX + 1, rows: largestY + 1 };

    this.matrix = new Matrix(this.size, { defaultValue: '.' });

    points.forEach(([x,y]) => {
      this.matrix.set(y, x, "#");
    });
  }

  apply(folds: Fold[]) {
    folds.forEach(fold => {
      if (fold.axis === 'y') {
        for (let columnIndex = 0; columnIndex < this.size.columns; columnIndex++) {
          this.matrix.set(fold.value, columnIndex, '-');
        }
      }
      if (fold.axis === 'x') {
        for (let rowIndex = 0; rowIndex < this.size.rows; rowIndex++) {
          this.matrix.set(rowIndex, fold.value, '|');
        }
      }
    });
  }

  get count() {
    return this.input.length;
  }

  toString() {
    return this.matrix.report(e => e);
  }
}

type Fold = {
  axis: 'x'|'y';
  value: number;
}

type Instructions = {
  folds: Fold[];
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

  const parseFold = (line: string) : Fold => {
    const match = line.match(/(?<axis>[y|x])=(?<value>\d+)$/);
    
    if (!match)
      throw new Error(`Failed to parse line <${line}> as fold`);
    
    //@ts-ignore
    return { axis: match?.groups['axis'] , value: parseInt(match?.groups['value']) };
  }

  const origami = new Origami(l.slice(0, indexOfBlankLine));
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
});