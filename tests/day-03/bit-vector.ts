export enum BitCriteria {
  LeastCommon,
  MostComon
}

export const mostCommonBit = (reports: string[], index: number) : '1' | '0' | 'tie' => 
  commonBit(reports, index, BitCriteria.MostComon);

export const leastCommonBit = (reports: string[], index: number) : '1' | '0' |'tie' => 
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