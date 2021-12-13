
import { expect } from "chai";
import { lines } from "core/text";
import Matrix, { Size } from 'core/matrix';

const parse = (input: string, size: Size) : Matrix<number> => {
  const matrix = new Matrix<number>(size);
  
  lines(input).forEach((line, row) => {
    line
      .split(' ')
      .map(it => it.trim())
      .filter(it => it.length > 0)
      .map(it => parseInt(it))
      .forEach((entry, column) => {
        matrix.add({
          postion: { column, row },
          value: entry
        });
      });
  });

  return matrix;
}

// npm test -- --grep "Matrix splitting"
describe('Matrix splitting', () => {
  it('Examples', () => {
    const input = `
       1   2   3   4   5
       6   7   8   9  10

      11  12  13  14  15
      16  17  18  19  20
      21  22  23  24  25
    `

    const matrix = parse(input, { rows: 5, columns: 5 });

    expect(matrix.size).to.eql({ rows: 5, columns: 5 });

    const [a, b] = matrix.splitAfterRow(1);

    expect(a.size).to.eql({ rows: 2, columns: 5 });
    expect(b.size).to.eql({ rows: 3, columns: 5 });

    expect(a.at(0,0)).to.eql(1);
    expect(a.at(1,4)).to.eql(10);

    expect(b.at(0,0)).to.eql(11);
    expect(b.at(2,4)).to.eql(25);
  });
});

describe('Matrix inversion', () => {
  it('Can flip around x axis', () => {
    const input = `
       1   2   3   4   5
       6   7   8   9  10
      11  12  13  14  15
      16  17  18  19  20
      21  22  23  24  25
    `

    const matrix = parse(input, { rows: 5, columns: 5 });

    const flippedAroundXAxis = matrix.flip('x');

    expect(flippedAroundXAxis.map((entry) => entry.value)).to.eql([
      21,22,23,24,25,
      16,17,18,19,20,
      11,12,13,14,15,
      6 ,7 ,8 ,9 ,10,
      1 ,2 ,3 ,4 ,5
    ]);

    // Shows that flip returns a copy, i.e, original one remains unchanged
    expect(matrix.map((entry) => entry.value)).to.eql([
      1 ,2 ,3 ,4 ,5,
      6 ,7 ,8 ,9 ,10,
      11,12,13,14,15,
      16,17,18,19,20,
      21,22,23,24,25
    ]);
  });
});