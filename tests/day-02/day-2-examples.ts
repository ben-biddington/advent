import { expect } from 'chai';
import * as fs from 'fs';
import { sum } from '../../core/array-extensions';

const calculatePosition = (input: string) => {
  const commands = input.split('\n')
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

  return { horizontal: totalForward - totalBack, depth: totalDown - totalUp };
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
    const actual = calculatePosition(raw);

    expect(expected).to.eql(actual);
  });

  it('Calculate the horizontal position and depth you would have after following the planned course.', () => {
    const raw = fs.readFileSync('./input/two/input').toString();

    const actual = calculatePosition(raw);

    expect(actual).to.eql({ horizontal: 1906, depth: 1017 });
  });
});