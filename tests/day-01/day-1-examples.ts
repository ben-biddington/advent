import { expect } from 'chai';
import * as fs from 'fs';
import { sum } from 'core/array-extensions';
import { lines } from 'core/internal/text';

const getIncreases = (numbers: number[]) => {
  return numbers.filter((value, index) => {
    if (index === 0)
      return false;
    
    const isIncrease = numbers[index] > numbers[index - 1];

    return isIncrease;
  });  
}

const getIncreasesInThreeMeasurementSlidingWindow = (numbers: number[]) => {
  let sums: number[] = [];

  for (let i = 0; i < numbers.length; i++) {
    const endIndex = i + 3;
    const window = numbers.slice(i, endIndex);

    if (window.length === 3)
    {
      sums.push(sum(window));
    }
  }

  return getIncreases(sums);
}

describe('--- Day 1: Sonar Sweep --- (part one)', () => {
  it('the number of times a depth measurement increases', () => {
    // https://adventofcode.com/2021/day/1#part1
    const input: number[] = lines(fs.readFileSync('./input/one/input').toString())
      .map(it => parseInt(it));
  
    expect(getIncreases(input).length).to.eql(1557);
  });
});

describe('--- Day 1: Sonar Sweep --- (part two)', () => {
  it('the basic example', () => {
    // Example taken from https://adventofcode.com/2021/day/1#part2
    const raw = `
      199
      200
      208
      210
      200
      207
      240
      269
      260
      263
    `;

    const input: number[] = lines(raw)
      .map(it => parseInt(it));

    expect(getIncreasesInThreeMeasurementSlidingWindow(input).length).to.eql(5);
  });

  it('three-measurement sliding window', () => {
    // https://adventofcode.com/2021/day/1#part2
    const input: number[] = lines(fs.readFileSync('./input/one/input').toString())
      .map(it => parseInt(it));
  
    expect(getIncreasesInThreeMeasurementSlidingWindow(input).length).to.eql(1608);
  });
});