
import { expect } from "chai";
import { lines } from "core/internal/text";
import  Matrix, { Size } from 'core/matrix';

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

describe.only('Matrices', () => {
  it('Examples', () => {
    const input = `
       1   2   3   4   5
       6   7   8   9  10
      11  12  13  14  15
      16  17  18  19  20
      21  22  23  24  25
    `

    const matrix = parse(input, { rows: 5, columns: 5 });
    
    expect(matrix.at(-1,-1)).to.be.undefined;

    expect(matrix.at(0,0)).to.eql(1);
    expect(matrix.at(0,4)).to.eql(5);
    
    expect(matrix.at(4,4)).to.eql(25);

    // [!] We are zero-based.
    expect(matrix.at(5,5)).to.be.undefined

    expect(matrix.at(10,10)).to.be.undefined;
  });

  it('Finding neighbours', () => {
    const input = `
       1   2   3   4   5
       6   7   8   9  10
      11  12  13  14  15
      16  17  18  19  20
      21  22  23  24  25
    `

    const matrix = parse(input, { rows: 5, columns: 5 });

    expect(matrix.neighbours(0, 0)).to.have.members([2, 7, 6]);
    expect(matrix.neighbours(0, 4)).to.have.members([4, 9, 10]);
    expect(matrix.neighbours(4, 4)).to.have.members([19, 20, 24]);
    expect(matrix.neighbours(4, 0)).to.have.members([16, 17, 22]);

    expect(matrix.neighbours(2, 2)).to.have.members([
       7,  8,   9,
      12,      14,
      17, 18,  19
    ]);

    expect(matrix.neighbours(-1, -1)).to.eql([]);
    expect(matrix.neighbours(5, 5)).to.eql([]);
  });
});