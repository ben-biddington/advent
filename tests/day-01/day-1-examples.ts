import { expect } from 'chai';
import * as fs from 'fs';

describe('Day 1, part 1', () => {
  it('sum increases like this', () => {
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