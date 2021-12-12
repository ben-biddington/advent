import { lines } from 'core/text';
import { mostCommonBit, leastCommonBit } from 'core/internal/bit-vector';

// https://adventofcode.com/2021/day/3
export const gammaRate = (input: string)   => powerConsumption(input, mostCommonBit);
export const epsilonRate = (input: string) => powerConsumption(input, leastCommonBit);

const powerConsumption = (input: string, bitComparison: (reports: string[], index: number) => '1' | '0' |'tie') => {
  const reports = lines(input);

  const result = [];

  const width = reports[0].length;

  for (let i = 0; i < width; i++) {
    result[i] = bitComparison(reports, i);
  }

  return parseInt(result.join(''), 2);
}