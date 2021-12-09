import { expect } from "chai";
import { sum } from "core/array-extensions";
import { lines } from "core/internal/text";
import * as fs from 'fs';

class Board {
  constructor(input: string) {

  }
}

type Adjacents = { 
  top?: number | undefined, 
  right?: number | undefined, 
  bottom?: number | undefined, 
  left?: number | undefined 
}

const lowPoints = (input: string) => {
  const matrix = matrixFrom(input);

  const columnCount = matrix[0].length;
  const rowCount    = matrix.length;

  const lowPoints = [];

  for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      const element = matrix[rowIndex][columnIndex];
      const neighbours = adjacentValues(matrix, columnIndex, rowIndex);

      const isLessThanAll = (n: number, neighbours: number[]) : boolean => {
        return neighbours.filter(neighbour => {
          return neighbour > n;
        }).length === neighbours.length;
      }

      if (isLessThanAll(element, neighbours)) {
        lowPoints.push([columnIndex, rowIndex]);
      }
    }
  }

  return lowPoints;
}

const adjacentValues = (matrix: number[][], x: number, y: number): number[] => {
  const neighbours = adjacents(matrix, x, y);
  
  const NO_VALUE = -1;
  
  return [
    neighbours.top    !== undefined ? neighbours.top    : NO_VALUE, 
    neighbours.right  !== undefined ? neighbours.right  : NO_VALUE,
    neighbours.bottom !== undefined ? neighbours.bottom : NO_VALUE,
    neighbours.left   !== undefined ? neighbours.left   : NO_VALUE,
  ]
    .filter(it => it !== NO_VALUE);
}

const adjacents = (matrix: number[][], x: number, y: number): Adjacents => {
  const rowAt = (index: number): number[] | undefined => matrix[index];
  
  return {
    top:    rowAt(y - 1)?.[x],
    right:  rowAt(y)?.[x + 1],
    bottom: rowAt(y + 1)?.[x],
    left:   rowAt(y)?.[x - 1],
  }
}

const matrixFrom = (input: string) => {
  return lines(input).map((line: string) => {
    const entries = [line.split('').length];

    line.split('').forEach((entry: string, index: number) => {
      entries[index] = parseInt(entry);
    });

    return entries;
  });
}

describe('--- Day 9: Smoke Basin ---', () => {
  it('The given example, find low points', () => {
    const input = `
    2199943210
    3987894921
    9856789892
    8767896789
    9899965678
    `;

    const matrix = matrixFrom(input);

    // Top-left
    expect(adjacents(matrix, 0, 0)).to.eql({
      top: undefined,
      right: 1,
      bottom: 3,
      left: undefined
    });

    // Top-right
    expect(adjacents(matrix, 9, 0)).to.eql({
      top: undefined,
      right: undefined,
      bottom: 1,
      left: 1,
    });

    // Bottom-right
    expect(adjacents(matrix, 9, 4)).to.eql({
      top: 9,
      right: undefined,
      bottom: undefined,
      left: 7,
    });

    // Bottom-left
    expect(adjacents(matrix, 0, 4)).to.eql({
      top: 8,
      right: 8,
      bottom: undefined,
      left: undefined,
    });

    expect(adjacents(matrix, 1, 1)).to.eql({
      top: 1,
      right: 8,
      bottom: 8,
      left: 3,
    });

    expect(adjacents(matrix, 9, 1)).to.eql({
      top: 0,
      right: undefined,
      bottom: 2,
      left: 2,
    });

    expect(adjacents(matrix, 8, 3)).to.eql({
      top: 9,
      right: 9,
      bottom: 7,
      left: 7,
    });
  });

  it('adjacent values', () => {
    const input = `
    2199943210
    3987894921
    9856789892
    8767896789
    9899965678
    `;

    const matrix = matrixFrom(input);

    expect(adjacentValues(matrix, 9, 1)).to.eql([0,2,2]);
  })

  it('Find low points', () => {
    // Your first goal is to find the low points - the locations that are lower than any of its adjacent locations. 
    // Most locations have four adjacent locations (up, down, left, and right); 
    // locations on the edge or corner of the map have three or two adjacent locations, respectively. 
    // (Diagonal locations do not count as adjacent.)
    const input = `
    2199943210
    3987894921
    9856789892
    8767896789
    9899965678
    `;

    expect(lowPoints(input)).to.eql([ [ 1, 0 ], [ 2, 2 ], [ 6, 4 ], [ 9, 0 ] ]);
  });

  it('Risk level', () => {
    // The risk level of a low point is 1 plus its height. 
    // In the above example, the risk levels of the low points are 2, 1, 6, and 6. 
    // The sum of the risk levels of all low points in the heightmap is therefore 15.
    const input = `
    2199943210
    3987894921
    9856789892
    8767896789
    9899965678
    `;

    const lows = lowPoints(input);

    const matrix = matrixFrom(input);

    const riskFactors = lows.map(coords => {
      return matrix[coords[1]][coords[0]] + 1;
    });

    expect(sum(riskFactors)).to.eql(15);
  });

  it('Real example', () => {
    // The risk level of a low point is 1 plus its height. 
    // In the above example, the risk levels of the low points are 2, 1, 6, and 6. 
    // The sum of the risk levels of all low points in the heightmap is therefore 15.
    const input = fs.readFileSync('./input/nine').toString();

    const lows = lowPoints(input);

    const matrix = matrixFrom(input);

    expect(matrix.length).to.eql(100);
    expect(matrix[0].length).to.eql(100);

    const riskFactors = lows.map(coords => {
      return matrix[coords[1]][coords[0]] + 1;
    });

    expect(sum(riskFactors)).to.eql(436);
  });
});