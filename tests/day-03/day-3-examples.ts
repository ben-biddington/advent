import { expect } from 'chai';
import * as fs from 'fs';

const mostCommonBit = (reports: string[], index: number) => {
  let zeroes = 0;
  let ones = 0;

  reports.forEach(report => {
    const value = report[index];

    if (value === '0') {
      zeroes++;
    } else {
      ones++;
    }
  });

  return ones > zeroes ? 1 : 0; // what about equality?
}

const leastCommonBit = (reports: string[], index: number) => {
  let zeroes = 0;
  let ones = 0;

  reports.forEach(report => {
    const value = report[index];

    if (value === '0') {
      zeroes++;
    } else {
      ones++;
    }
  });

  return ones < zeroes ? 1 : 0; // what about equality?
}

const gammaRate = (input: string) => {
  const reports = input.split('\n').map(it => it.trim()).filter(it => it.length > 0);

  const result = [];

  const width = reports[0].length;

  for (let i = 0; i < width; i++) {
    result[i] = mostCommonBit(reports, i);
  }

  return parseInt(result.join(''), 2);
}

const epsilonRate = (input: string) => {
  const reports = input.split('\n').map(it => it.trim()).filter(it => it.length > 0);

  const result = [];

  const width = reports[0].length;

  for (let i = 0; i < width; i++) {
    result[i] = leastCommonBit(reports, i);
  }

  return parseInt(result.join(''), 2);
}

describe('--- Day 3: --- Binary Diagnostic (part one)', () => {
  it(`You need to use the binary numbers in the diagnostic report to generate two new binary numbers 
  
    (called the gamma rate and the epsilon rate). 
  
    The power consumption can then be found by multiplying the gamma rate by the epsilon rate.

    Each bit in the gamma rate can be determined by finding the most common bit in the corresponding 
    position of all numbers in the diagnostic report. For example, given the following diagnostic report:`, () => {

    const raw = `
    00100
    11110
    10110
    10111
    10101
    01111
    00111
    11100
    10000
    11001
    00010
    01010
    `
    expect(gammaRate(raw)).to.eql(22);
    expect(epsilonRate(raw)).to.eql(9);
    expect(epsilonRate(raw) * gammaRate(raw)).to.eql(198);
  });

  it(`Real report`, () => {
    const raw = fs.readFileSync('./input/three/input').toString(); 
    
    // [!] Ouch, the data on file is wider than the example: more digits than the 5 shown above.

    expect(epsilonRate(raw) * gammaRate(raw)).to.eql(3309596);
  });
});

