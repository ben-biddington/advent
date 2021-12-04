import { fromBinary } from "core/internal/numbers";
import { lines } from "core/internal/text";
import { BitCriteria, leastCommonBit, mostCommonBit } from "../internal/bit-vector";

export const oxygenGeneratorRating = (input: string) => {
  const reports = lines(input);

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

export const carbonDioxideGeneratorRating = (input: string) => {
  const reports = lines(input);

  let filteredReports = reports;
  
  const width = reports[0].length;

  for (let i = 0; i < width; i++) {
    filteredReports = filterBy(filteredReports, i, BitCriteria.LeastCommon);
    if (filteredReports.length === 1)
      break;
  }

  if (filteredReports.length > 1)
    throw new Error(`There are <${filteredReports.length}> reports, expected 1.`);

  return fromBinary(filteredReports[0]);
}

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

  if (theLeastCommonBit === 'tie') {
    // In the third position, there are an equal number of 0 bits and 1 bits (one each). 
    // So, to find the CO2 scrubber rating, keep the number with a 0 in that position: 01010.
    return reports.filter((report: string) => report[index] == '0');  
  }

  return reports.filter((report: string) => report[index] == theLeastCommonBit);
}