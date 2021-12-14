
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

describe('Removing entries', () => {
  it('can remove rows', () => {
    const input = `
       1   2   3   4   5
       6   7   8   9  10
      --  --  --  --  -- 
      11  12  13  14  15
      16  17  18  19  20
      21  22  23  24  25
    `

    const matrix = new Matrix<string>({ rows: 6, columns: 5 });

    lines(input).forEach((line, row) => {
      line
        .split(' ')
        .map(it => it.trim())
        .filter(it => it.length > 0)
        .forEach((entry, column) => {
          matrix.add({
            postion: { column, row },
            value: entry
          });
        });
    });

    const next = matrix.withoutRow(2);

    expect(next.size).to.eql({ rows: 5, columns: 5 });
    expect(matrix.size).to.eql({ rows: 6, columns: 5 });

    expect(next.map((entry) => parseInt(entry.value))).to.eql([
      1 ,2 ,3 ,4 ,5,
      6 ,7 ,8 ,9 ,10,
      11,12,13,14,15,
      16,17,18,19,20,
      21,22,23,24,25
    ]);
  });

  it('can remove columns', () => {
    const input = `
       1   2  |  3   4   5
       6   7  |  8   9  10
      11  12  | 13  14  15
      16  17  | 18  19  20
      21  22  | 23  24  25
    `

    const matrix = new Matrix<string>({ rows: 5, columns: 6 });

    lines(input).forEach((line, row) => {
      line
        .split(' ')
        .map(it => it.trim())
        .filter(it => it.length > 0)
        .forEach((entry, column) => {
          matrix.add({
            postion: { column, row },
            value: entry
          });
        });
    });

    const next = matrix.withoutColumn(2);

    expect(next.size).to.eql({ rows: 5, columns: 5 });
    expect(matrix.size).to.eql({ rows: 5, columns: 6 });

    expect(next.map((entry) => parseInt(entry.value))).to.eql([
      1 ,2 ,3 ,4 ,5,
      6 ,7 ,8 ,9 ,10,
      11,12,13,14,15,
      16,17,18,19,20,
      21,22,23,24,25
    ]);

    expect(next.at(4,4)).to.eql('25');
    expect(matrix.at(4,4)).to.eql('24');
  });
})

// npm test -- --grep "Matrix splitting"
describe('Matrix splitting', () => {
  it('can split rows', () => {
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

  it('can split columns', () => {
    const input = `
       1   2     3   4   5
       6   7     8   9  10
      11  12    13  14  15
      16  17    18  19  20
      21  22    23  24  25
    `

    const matrix = parse(input, { rows: 5, columns: 5 });

    const [a, b] = matrix.splitAfterColumn(1);

    expect(a.size).to.eql({ rows: 5, columns: 2 });
    expect(b.size).to.eql({ rows: 5, columns: 3 });

    expect(a.map((entry) => entry.value)).to.eql([
      1,2,
      6,7,
      11,12,
      16,17,
      21,22
    ]);

    expect(b.map((entry) => entry.value)).to.eql([
      3,4,5,
      8,9,10,
      13,14,15,
      18,19,20,
      23,24,25
    ]);

    expect(a.at(0,0)).to.eql(1);
    expect(a.at(4,1)).to.eql(22);

    expect(b.at(0,0)).to.eql(3);
    expect(b.at(4,2)).to.eql(25);
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

  it('Can flip around y axis', () => {
    const input = `
       1   2   3   4   5
       6   7   8   9  10
      11  12  13  14  15
      16  17  18  19  20
      21  22  23  24  25
    `

    const matrix = parse(input, { rows: 5, columns: 5 });

    const flippedAroundYAxis = matrix.flip('y');

    expect(flippedAroundYAxis.map((entry) => entry.value)).to.eql([
      5 ,4 ,3 ,2 ,1,
      10,9 ,8 ,7, 6,
      15,14,13,12,11,
      20,19,18,17,16,
      25,24,23,22,21
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