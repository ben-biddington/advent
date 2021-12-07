import { expect } from "chai";
import { range, sum } from "core/array-extensions";
import * as fs from 'fs';

const minimizeDistance = (input: string) => {
  return minimize(input, (position, distance) =>
    Math.max(position, distance) - Math.min(position, distance)
  );
}

const minimizeFuel = (input: string) => {
  const fuelUsed = (moveCount: number) => sum(range(1, moveCount));
  
  return minimize(input, (position, distance) => 
    fuelUsed(Math.max(position, distance) - Math.min(position, distance))
  );
}

// https://www.geeksforgeeks.org/optimum-location-point-minimize-total-distance/
const minimize = (
  input: string,
  operator: (position: number, distance: number) => number
) => {
  const distances = parse(input);

  let last = 0;

  // [i] Start from zero and move right until numbers start to increase
  for (let position = 0; position >= 0; position++) {
    const current = sum(distances.map(n => operator(position, n)));

    if (position == 0) {
      last = current;
    } else if (position > 0) {
      if (current > last)
        break;
      
      last = current;
    }
  }

  return last;
}

const parse = (input: string) => input
  .split(',')
  .map(it => parseInt(it))
  .sort((a, b) => a - b);

describe('--- Day 7: The Treachery of Whales --- (part one)', () => {
  it(`Minimise distance`, () => {
    const input = `16,1,2,0,4,2,7,1,2,14`;

    expect(minimizeDistance(input)).to.eql(37);
  });

  it(`Real example`, () => {
    const input = fs.readFileSync('./input/seven').toString();

    expect(minimizeDistance(input)).to.eql(353800);
  });
});

describe('--- Day 7: The Treachery of Whales --- (part two)', () => {
  it('Minimise fuel', () => {
    const input = `16,1,2,0,4,2,7,1,2,14`;
  
    expect(minimizeFuel(input)).to.eql(168);
  });

  it(`Real example`, () => {
    const input = fs.readFileSync('./input/seven').toString();

    expect(minimizeFuel(input)).to.eql(98119739);
  });
});

describe('Range (array of integers)', () => {
  it(`Examples`, () => {
    expect(range(0, 0)).to.eql([]);
    expect(range(0, 1)).to.eql([0]);

    expect(range(1, 1)).to.eql([1]);
    expect(range(1, 3)).to.eql([1,2,3]);

    expect(range(1, 10)).to.eql([1,2,3,4,5,6,7,8,9,10]);
  });
});