import { expect } from 'chai';
import * as fs from 'fs';
import { sum } from '../../core/array-extensions';

describe('--- Day 3: --- (part one)', () => {
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

    expect(expected).to.eql(actual);
  });
});

