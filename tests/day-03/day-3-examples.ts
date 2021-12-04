import { expect } from 'chai';
import * as fs from 'fs';
import { carbonDioxideGeneratorRating, oxygenGeneratorRating } from 'core/submarine/life-support';
import { gammaRate, epsilonRate } from 'core/submarine/power-consumption';

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

describe('--- Day 3: --- Binary Diagnostic (part two)', () => {
  // Next, you should verify the life support rating, which can be determined by 
  // multiplying the oxygen generator rating by the CO2 scrubber rating.

  // ...start with the full list of binary numbers from your diagnostic report and consider just the first bit of those numbers. Then:
  it('the given example', () => {
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
    expect(oxygenGeneratorRating(raw)).to.eql(23);
    expect(carbonDioxideGeneratorRating(raw)).to.eql(10);

    const lifeSupportRating = oxygenGeneratorRating(raw) * carbonDioxideGeneratorRating(raw);

    expect(lifeSupportRating).to.eql(230);
  });

  it(`Real report`, () => {
    const raw = fs.readFileSync('./input/three/input').toString(); 

    expect(oxygenGeneratorRating(raw) * carbonDioxideGeneratorRating(raw)).to.eql(2981085);
  });
});
