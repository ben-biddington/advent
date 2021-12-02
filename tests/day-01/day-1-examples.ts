import { expect } from 'chai';
import { previousSaturday } from 'date-fns';
import * as fs from 'fs';
import { isExportDeclaration } from 'typescript';

describe('--- Day 1: Sonar Sweep --- (part one)', () => {
  it('the number of times a depth measurement increases', () => {
    // https://adventofcode.com/2021/day/1#part1
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

describe('--- Day 1: Sonar Sweep --- (part two)', () => {
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

    let sums: number[] = [];

    for (let i = 0; i < input.length; i++) {
      const endIndex = i + 3;
      const window = input.slice(i, endIndex);

      if (window.length === 3)
      {
        sums.push(window.reduce((previous, current) => previous + current));
      }
    }

    expect(sums).to.eql([
      607,
      618,
      618,
      617,
      647,
      716,
      769,
      792
    ]);

    const increases = sums.filter((value, index) => {
      if (index === 0)
        return false;
      
      const isIncrease = sums[index] > sums[index - 1];

      return isIncrease;
    });

    expect(increases.length).to.eql(5);
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