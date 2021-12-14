
import { expect } from "chai";
import { lines } from "core/text";
import Matrix, { Size } from 'core/matrix';

const parse = (input: string, size: Size) : Matrix<string> => {
  const matrix = new Matrix<string>(size);
  
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

  return matrix;
}

// npm test -- --grep "Merging matrices"
describe('Merging matrices', () => {
  it('Examples', () => {
    const A = `
       .   .   .   .   .
       .   .   .   .   .
       .   .   .   .   .
       .   .   .   .   .
       .   .   .   .   .
    `

    const B = `
       #   .   .   .   #
       .   #   .   #   .
       .   .   #   .   .
       .   #   .   #   .
       #   .   .   .   #
    `

    const a = parse(A, { rows: 5, columns: 5 });
    const b = parse(B, { rows: 5, columns: 5 });

    expect(a.merge(b, (_a,b) => b).at(0,0)).to.eql('#');
    expect(a.merge(b, (_a,b) => b).at(1,1)).to.eql('#');
    expect(a.merge(b, (_a,b) => b).at(2,2)).to.eql('#');
    expect(a.merge(b, (_a,b) => b).at(3,3)).to.eql('#');
    expect(a.merge(b, (_a,b) => b).at(4,4)).to.eql('#');
    expect(a.merge(b, (_a,b) => b).at(0,4)).to.eql('#');
    expect(a.merge(b, (_a,b) => b).at(1,3)).to.eql('#');
    expect(a.merge(b, (_a,b) => b).at(2,2)).to.eql('#');
    expect(a.merge(b, (_a,b) => b).at(3,1)).to.eql('#');
    expect(a.merge(b, (_a,b) => b).at(0,4)).to.eql('#');

    expect(a.at(0,0)).to.eql('#');
    expect(a.at(0,0)).to.eql('#');
  });
});