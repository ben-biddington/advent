import { expect } from "chai";
import { range, sum } from "core/array-extensions";
import * as fs from 'fs';

const minimize = (input: string) => {
  const distances = input
    .split(',')
    .map(it => parseInt(it))
    .sort((a, b) => a - b);

  let max = distances[distances.length-1] * 200;
  let min = max;

  // https://www.geeksforgeeks.org/optimum-location-point-minimize-total-distance/

  for (let distance = max; distance >= 0; distance--) {
    const current = sum(distances.map(n => {
      return Math.max(distance, n) - Math.min(distance, n);
    }));

    if (current < min) {
      min = current;
    }
  }

  return min;
}

const fuelUsed = (moveCount: number) => {
  let result = 0;

  for (let index = 1; index <= moveCount; index++) {
    result += index;    
  }

  return result;

  return sum(range(1, moveCount));
}

// Two calculations: distance and fuel used
const minimizeFuel = (input: string) => {
  const distances = input
    .split(',')
    .map(it => parseInt(it))
    .sort((a, b) => a - b);

  const fuelCache = new Map<number,number>();

  const getFuelUsed = (distance: number) : number => {
    if (false == fuelCache.has(distance)) { 
      fuelCache.set(distance, fuelUsed(distance));
    }
    
    return fuelCache.get(distance) || 0;
  }

  let last    = 0;

  // Start from zero and move right until numbers start to increase
  for (let position = 0; position >= 0; position++) {
    const current = sum(distances.map(n => {
        const distanceMoved = Math.max(position, n) - Math.min(position, n);
     
        return getFuelUsed(distanceMoved);
      }
    ));

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

describe('--- Day 7: The Treachery of Whales --- (part one)', () => {
  it(`This is the cheapest possible outcome (the given example)`, () => {
    const input = `16,1,2,0,4,2,7,1,2,14`;
    expect(minimize(input)).to.eql(37);
  });

  it(`Real example`, () => {
    const input = fs.readFileSync('./input/seven').toString();

    expect(minimize(input)).to.eql(353800);
  });
});

describe('--- Day 7: The Treachery of Whales --- (part two)', () => {
  it(`Minimise fuel`, () => {
    const input = `16,1,2,0,4,2,7,1,2,14`;
    expect(minimizeFuel(input)).to.eql(168);
  });

  it(`Real example`, () => {
    const input = fs.readFileSync('./input/seven').toString();

    expect(minimizeFuel(input)).to.eql(98119739);
  });
});