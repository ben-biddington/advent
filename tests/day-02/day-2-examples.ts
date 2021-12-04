import { expect } from 'chai';
import * as fs from 'fs';
import { sum } from 'core/array-extensions';
import { lines } from 'core/internal/text';

// [i] For part one only.
const calculatePosition = (input: string) => {
  const commands = lines(input)
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

// [i] Is more correct: includes aim.
const calculatePositionVersionTwo = (input: string) => {
  const commands = lines(input)
    .filter(it => it.length > 0)
    .map(text => {
      const parts = text.split(' ');
      return { 
        command: parts[0], 
        value: parseInt(parts[1])
      }
    });

  let aim = 0;
  let horizontal = 0;
  let depth = 0;

  // down X increases your aim by X units.
  // up X decreases your aim by X units.
  // forward X does two things:
  //    It increases your horizontal position by X units.
  //    It increases your depth by your aim multiplied by X.

  commands.forEach(command => {
    if (command.command === 'down') {
      aim += command.value;
    }
    if (command.command === 'up') {
      aim -= command.value;
    }
    if (command.command === 'forward') {
      horizontal += command.value;
      depth += (aim * command.value);
    }
  });

  return { horizontal, depth };
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

describe('--- Day 2: Dive! --- (part two)', () => {
  it(`
      The commands also mean something entirely different than you first thought:
  
        down X increases your aim by X units.
        up X decreases your aim by X units.
        forward X does two things:
          It increases your horizontal position by X units.
          It increases your depth by your aim multiplied by X.

      Again note that since you're on a submarine, down and up do the opposite of what you might expect: "down" means aiming in the positive direction.
    `, () => {

    const raw = `
    forward 5
    down 5
    forward 8
    up 3
    down 8
    forward 2
    `;

    const expected = { horizontal: 15, depth: 60 }
    const actual = calculatePositionVersionTwo(raw);

    expect(expected).to.eql(actual);
  });

  it(`
    Using this new interpretation of the commands, calculate the horizontal position and depth you would have after following the planned course. 
  
    What do you get if you multiply your final horizontal position by your final depth?
  `, () => {
    const raw = fs.readFileSync('./input/two/input').toString();

    const actual = calculatePositionVersionTwo(raw);

    expect(actual).to.eql({ horizontal: 1906, depth: 1021972 });
    expect(actual.depth * actual.horizontal).to.eql(1947878632);
  });
});