import { expect } from "chai";
import { sum } from "core/array-extensions";
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

describe.only('--- Day 7: The Treachery of Whales --- (part one)', () => {
  it(`This is the cheapest possible outcome (the given example)`, () => {
    const input = `16,1,2,0,4,2,7,1,2,14`;
    expect(minimize(input)).to.eql(37);
  });

  it(`Real example`, () => {
    const input = fs.readFileSync('./input/seven').toString();

    expect(minimize(input)).to.eql(353800);
  });
});