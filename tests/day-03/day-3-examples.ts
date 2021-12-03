import { expect } from 'chai';
import * as fs from 'fs';

enum BitCriteria {
  LeastCommon,
  MostComon
}

const fromBinary = (binaryNumber: string) => parseInt(binaryNumber, 2);

// Select the matching reports by BitCriteria
const filterBy = (reports: string[], index: number, criteria: BitCriteria) => {
  if (criteria == BitCriteria.MostComon) {
    const theMostCommonBit = mostCommonBit(reports, index).toString();

    if (theMostCommonBit === 'tie') {
      // In the fifth position, there are an equal number of 0 bits and 1 bits (one each). 
      // So, to find the oxygen generator rating, keep the number with a 1 in that position: 10111.
      return reports.filter((report: string) => report[index] == '1');  
    }

    return reports.filter((report: string) => report[index] == theMostCommonBit);
  }

  const theLeastCommonBit = leastCommonBit(reports, index).toString();
  return reports.filter((report: string) => report[index] == theLeastCommonBit);
}

const oxygenGeneratorRating = (reports: string[]) => {
  let filteredReports = reports;
  
  const width = reports[0].length;

  for (let i = 0; i < width; i++) {
    filteredReports = filterBy(filteredReports, i, BitCriteria.MostComon);
    if (filteredReports.length === 1)
      break;
  }

  if (filteredReports.length > 1)
    throw new Error(`There are <${filteredReports.length}> reports, expected 1.`);

  return fromBinary(filteredReports[0]);
}

const mostCommonBit = (reports: string[], index: number) : '1' | '0' | 'tie' => 
  commonBit(reports, index, BitCriteria.MostComon);

const leastCommonBit = (reports: string[], index: number) : '1' | '0' |'tie' => 
  commonBit(reports, index, BitCriteria.LeastCommon);

const commonBit = (reports: string[], index: number, criteria: BitCriteria) : '1' | '0' | 'tie' => {
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

  if (ones === zeroes)
    return 'tie';

  if (criteria === BitCriteria.MostComon)
    return ones > zeroes ? '1' : '0';
  
  return ones < zeroes ? '1' : '0';
}

const gammaRate = (input: string)   => powerConsumption(input, mostCommonBit);
const epsilonRate = (input: string) => powerConsumption(input, leastCommonBit);

const powerConsumption = (input: string, bitComparison: (reports: string[], index: number) => '1' | '0' |'tie') => {
  const reports = input.split('\n').map(it => it.trim()).filter(it => it.length > 0);

  const result = [];

  const width = reports[0].length;

  for (let i = 0; i < width; i++) {
    result[i] = bitComparison(reports, i);
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

    const reports = raw.split('\n').map(it => it.trim()).filter(it => it.length > 0);

    expect(reports.length).to.eql(12);

    // 1. start with the full list of binary numbers from your diagnostic report and consider just the first bit of those numbers.
    const firstBitOfEachReport: string[] = reports.map(it => it[0]);

    expect(firstBitOfEachReport.length).to.eql(12);

    // 2. Keep only numbers selected by the bit criteria for the type of rating value for which you are searching. 
    // Discard numbers which do not match the bit criteria.

    const ox = oxygenGeneratorRating(reports);

    expect(ox).to.eql(23);

    const expected = 230;

  });
});
