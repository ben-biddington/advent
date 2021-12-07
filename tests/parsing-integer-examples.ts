
import { expect } from "chai";

const parseIntegersA = (input: string) => {
  return input.split(',').map(parseInt);
}

const parseIntegersB = (input: string) => {
  return input.split(',').map((n, index) => parseInt(n));
}

describe('Parsing integers does not work as expected', () => {
  // This is because `map` takes a function (value: T, index: number) and `parseInt` then treats `index` as radix.
  // More here: https://raddevon.com/articles/cant-use-parseint-map-javascript/
  it('Examples', () => {
    const input = `16,1,2,0`;
  
    expect(parseIntegersA(input)).to.eql( [ 16, NaN , NaN , 0 ] );
    expect(parseIntegersB(input)).to.eql( [ 16, 1   , 2   , 0 ] );
  });
});