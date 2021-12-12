import { expect } from "chai";
import { lines } from "core/text";
import Matrix, { Size } from "core/matrix";
import * as fs from 'fs';

const parse = (input: string, size: Size) : Matrix<Octopus> => {
  const matrix = new Matrix<Octopus>(size);
  
  lines(input).forEach((line, row) => {
    line
      .split('')
      .map(it => it.trim())
      .filter(it => it.length > 0)
      .map(it => parseInt(it))
      .forEach((entry, column) => {
        matrix.add({
          postion: { column, row },
          value: new Octopus(entry)
        });
      });
  });

  matrix.forEach(entry => 
    entry.value.introduce(matrix.neighbours(entry.postion.row, entry.postion.column))
  );

  return matrix;
}

class Octopus {
  energy: number = 0;
  private neighbours: Octopus[] = [];
  hasFlashed = false;

  constructor(energy: number) {
    this.energy = energy;
  }

  step() {
    this.hasFlashed = false;
    this.increment();
  }

  increment() {
    if (this.energy <= 9) {
      this.energy += 1;
    }
  }

  notify() {
    if (false === this.hasFlashed) {
      this.increment();
      this.flash();
    }
  }

  flash() {
    if (this.energy > 9 && false == this.hasFlashed) {
      this.energy = 0;
      this.hasFlashed = true;

      this.neighbours.forEach(it => it.notify());
    }
  }

  introduce(neighbours: Octopus[]) {
    this.neighbours = neighbours;
  }
}

describe('--- Day 11: Dumbo Octopus --- (part one)', () => {
  it('Pulsing at 9', () => {
    const input = `
    11111
    19991
    19191
    19991
    11111
    `

    const matrix = parse(input, { columns: 5, rows: 5 });

    // 1 
    matrix.forEach(it => it.value.step());
    matrix.forEach(it => it.value.flash());

    expect(matrix.report(it => it.energy.toString())).to.eql(
    `
34543
40004
50005
40004
34543
    `.trim()
    );

    // 2
    matrix.forEach(it => it.value.step());
    matrix.forEach(it => it.value.flash());

    expect(matrix.report(it => it.energy.toString())).to.eql(
    `
45654
51115
61116
51115
45654
    `.trim()
    );
  });

  it('100 steps', () => {
    const input = `
    5483143223
    2745854711
    5264556173
    6141336146
    6357385478
    4167524645
    2176841721
    6882881134
    4846848554
    5283751526
    `

    const matrix = parse(input, { columns: 10, rows: 10 });

    let flashes = 0;

    for (let index = 0; index < 100; index++) {
      matrix.forEach(it => it.value.step());
      matrix.forEach(it => it.value.flash());
      flashes += matrix.values().filter(it => it.energy === 0).length;
    }

    expect(flashes).to.eql(1656);
  });

  it('100 steps, actual example', () => {
    const input = fs.readFileSync('./input/eleven').toString();

    const matrix = parse(input, { columns: 10, rows: 10 });

    let flashes = 0;

    for (let index = 0; index < 100; index++) {
      matrix.forEach(it => it.value.step());
      matrix.forEach(it => it.value.flash());
      flashes += matrix.values().filter(it => it.energy === 0).length;
    }

    expect(flashes).to.eql(1613);
  });

  it('Larger example', () => {
    const input = `
    5483143223
    2745854711
    5264556173
    6141336146
    6357385478
    4167524645
    2176841721
    6882881134
    4846848554
    5283751526
    `

    const matrix = parse(input, { columns: 10, rows: 10 });

    // 1
    matrix.forEach(it => it.value.step());
    matrix.forEach(it => it.value.flash());

    expect(matrix.report(it => it.energy.toString())).to.eql(
    `
6594254334
3856965822
6375667284
7252447257
7468496589
5278635756
3287952832
7993992245
5957959665
6394862637
    `.trim()
    );

    // 2
    matrix.forEach(it => it.value.step());
    matrix.forEach(it => it.value.flash());

    expect(matrix.report(it => it.energy.toString())).to.eql(
    `
8807476555
5089087054
8597889608
8485769600
8700908800
6600088989
6800005943
0000007456
9000000876
8700006848
    `.trim()
    );

    // 3
    matrix.forEach(it => it.value.step());
    matrix.forEach(it => it.value.flash());

    expect(matrix.report(it => it.energy.toString())).to.eql(
    `
0050900866
8500800575
9900000039
9700000041
9935080063
7712300000
7911250009
2211130000
0421125000
0021119000
    `.trim()
    );

    // 4
    matrix.forEach(it => it.value.step());
    matrix.forEach(it => it.value.flash());

    expect(matrix.report(it => it.energy.toString())).to.eql(
    `
2263031977
0923031697
0032221150
0041111163
0076191174
0053411122
0042361120
5532241122
1532247211
1132230211
    `.trim()
    );

    // 5
    matrix.forEach(it => it.value.step());
    matrix.forEach(it => it.value.flash());

    expect(matrix.report(it => it.energy.toString())).to.eql(
    `
4484144000
2044144000
2253333493
1152333274
1187303285
1164633233
1153472231
6643352233
2643358322
2243341322
    `.trim()
    );
  });
});

describe('--- Day 11: Dumbo Octopus --- (part two)', () => {
  it('synchronized flashes', () => {
    const input = `
    5483143223
    2745854711
    5264556173
    6141336146
    6357385478
    4167524645
    2176841721
    6882881134
    4846848554
    5283751526
    `

    const matrix = parse(input, { columns: 10, rows: 10 });

    let done = false;
    let generations = 0;
    
    while (!done) {
      matrix.forEach(it => it.value.step());
      matrix.forEach(it => it.value.flash());
      generations++;
      done = matrix.values().filter(it => it.energy === 0).length === 100;
    }

    expect(generations).to.eql(195);
  });

  it('The real example', () => {
    const input = fs.readFileSync('./input/eleven').toString();

    const matrix = parse(input, { columns: 10, rows: 10 });

    let done = false;
    let generations = 0;
    
    while (!done) {
      matrix.forEach(it => it.value.step());
      matrix.forEach(it => it.value.flash());
      generations++;
      done = matrix.values().filter(it => it.energy === 0).length === 100;
    }

    expect(generations).to.eql(510);
  });
});