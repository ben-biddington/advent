import { expect } from 'chai';
import * as fs from 'fs';
import { sum } from '../../core/array-extensions';

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
      sums.push(window.reduce((previous, current) => previous + current));
    }
  }

  return getIncreases(sums);
}

describe('--- Day 2: Dive! --- (part one)', () => {
  it('the given example', () => {
    const raw = `
    forward 5
    down 5
    forward 8
    up 3
    down 8
    forward 2
    `;

    const expected = { horizontal: 15, depth: 10 }
    
    const commands = raw.split('\n')
      .map(it => it.trim())
      .filter(it => it.length > 0)
      .map(text => {
        const parts = text.split(' ');
        return { 
          command: parts[0], 
          value: parseInt(parts[1])
        }
      });

    const totalUp   = sum(commands.filter(it => it.command === 'up').map(it => it.value));
    const totalDown = sum(commands.filter(it => it.command === 'down').map(it => it.value));

    const totalForward = sum(commands.filter(it => it.command === 'forward').map(it => it.value));
    const totalBack    = sum(commands.filter(it => it.command === 'back').map(it => it.value));

    const actual = { horizontal: totalForward - totalBack, depth: totalDown - totalUp };

    expect(expected).to.eql(actual);
  });

  it('Calculate the horizontal position and depth you would have after following the planned course.', () => {
    const raw = fs.readFileSync('./input/two/input').toString();

    const expected = { horizontal: 1906, depth: 1017 }
    
    const commands = raw.split('\n')
      .map(it => it.trim())
      .filter(it => it.length > 0)
      .map(text => {
        const parts = text.split(' ');
        return { 
          command: parts[0], 
          value: parseInt(parts[1])
        }
      });

    const totalUp = commands.filter(it => it.command === 'up').map(it => it.value).reduce((a,b) => a + b, 0);
    const totalDown = commands.filter(it => it.command === 'down').map(it => it.value).reduce((a,b) => a + b, 0);

    const totalForward = commands.filter(it => it.command === 'forward').map(it => it.value).reduce((a,b) => a + b, 0);
    const totalBack = commands.filter(it => it.command === 'back').map(it => it.value).reduce((a,b) => a + b, 0);

    const actual = { horizontal: totalForward - totalBack, depth: totalDown - totalUp };

    expect(expected).to.eql(actual);
  });
});