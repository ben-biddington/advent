import { expect } from 'chai';
import * as fs from 'fs';

const getIncreases = (numbers: number[]) => {
  return numbers.filter((value, index) => {
    if (index === 0)
      return false;
    
    const isIncrease = numbers[index] > numbers[index - 1];

    return isIncrease;
  });  
}

const getIncreasesInThreeMeasurementSlidingwindow = (numbers: number[]) => {
  let sums: number[] = [];

  for (let i = 0; i < numbers.length; i++) {
    const endIndex = i + 3;
    const window = numbers.slice(i, endIndex);

    if (window.length === 3)
    {
      sums.push(window.reduce((previous, current) => previous + current));
    }
  }

  return getIncreases(sums);
}

describe('--- Day 1: Sonar Sweep --- (part one)', () => {
  it('the number of times a depth measurement increases', () => {
    // https://adventofcode.com/2021/day/1#part1
    const input: number[] = fs.readFileSync('./input/one/input').toString()
      .split('\n')
      .map(it => it.trim())
      .map(it => parseInt(it));
  
    expect(getIncreases(input).length).to.eql(1557);
  });
});

describe('--- Day 1: Sonar Sweep --- (part two)', () => {
  // https://adventofcode.com/2021/day/1#part2
  it('the basic example', () => {
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

    const input: number[] = raw
      .split('\n')
      .map(it => it.trim())
      .map(it => parseInt(it))
      .filter(it => false == isNaN(it));

    expect(input.length).to.eql(10);

    expect(getIncreasesInThreeMeasurementSlidingwindow(input).length).to.eql(5);
  });

  it('three-measurement sliding window', () => {
    // https://adventofcode.com/2021/day/1#part2
    const input: number[] = fs.readFileSync('./input/one/input').toString()
      .split('\n')
      .map(it => it.trim())
      .map(it => parseInt(it));
  
    const increases = input.filter((value, index) => {
      if (index === 0)
        return false;
      
      const isIncrease = input[index] > input[index - 1];

      return isIncrease;
    });

    expect(increases.length).to.eql(1557);
  });
});