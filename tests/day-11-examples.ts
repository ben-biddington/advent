import { expect } from "chai";
import { lines } from "core/internal/text";
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

  constructor(energy: number) {
    this.energy = energy;
  }

  introduce(neighbours: Octopus[]) {
    this.neighbours = neighbours;
  }
}

describe.only('--- Day 11: Dumbo Octopus --- (part one)', () => {
  it('abc', () => {
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

    expect(matrix.at(0,0).energy).to.eql(5);
    expect(matrix.at(9,9).energy).to.eql(6);

    expect(matrix.at(-1,-1)).to.be.undefined;
  });
});