import Matrix, { Size } from "core/matrix";

export const parse = (input: string[]): Origami => {
  const points = input
    .map(it => it.split(','))
    .map(it => [ parseInt(it[0]), parseInt(it[1]) ]);

  const largestX = points.map(it => it[0]).sort((a,b) => b - a)[0];
  const largestY = points.map(it => it[1]).sort((a,b) => b - a)[0];

  const size = { columns: largestX + 1, rows: largestY + 1 };

  const matrix = new Matrix(size, { defaultValue: '.' });

  points.forEach(([x,y]) => {
    matrix.set(y, x, "#");
  });

  return new Origami(matrix);
}

export class Origami {
  private input: string[] = [];
  private matrix: Matrix<string>;
  private size: Size;

  constructor(matrix: Matrix<string>) {
    this.size = matrix.size;
    this.matrix = matrix;
  }

  apply(folds: Fold[]) {
    folds.forEach(fold => {
      if (fold.axis === 'y') {
        for (let columnIndex = 0; columnIndex < this.size.columns; columnIndex++) {
          this.matrix.set(fold.value, columnIndex, '-');
        }
      }
      if (fold.axis === 'x') {
        for (let rowIndex = 0; rowIndex < this.size.rows; rowIndex++) {
          this.matrix.set(rowIndex, fold.value, '|');
        }
      }
    });
  }

  fold(fold: Fold) : Origami {
    const temp = this.matrix.withoutRow(fold.value);
    const [a,b] = temp.splitAfterRow(fold.value - 1);

    return new Origami(
      a.merge(b.flip('x'), (a,b) => {
        return a == '#' || b == '#' ? '#' : '.';
    }));
  }

  get count() {
    return this.matrix
      .map(it => it.value)
      .filter(it => it === '#').length;
  }

  toString() {
    return this.matrix.report(e => e);
  }
}

export type Fold = {
  axis: 'x'|'y';
  value: number;
}

export type Instructions = {
  folds: Fold[];
}