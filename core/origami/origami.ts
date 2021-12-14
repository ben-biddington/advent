import Matrix, { Size } from "core/matrix";

export class Origami {
  private input: string[] = [];
  private matrix: Matrix<string>;
  private size: Size;

  constructor(input: string[]) {
    this.input = input;

    const points = input
      .map(it => it.split(','))
      .map(it => [ parseInt(it[0]), parseInt(it[1]) ]);
    
    const largestX = points.map(it => it[0]).sort((a,b) => b - a)[0];
    const largestY = points.map(it => it[1]).sort((a,b) => b - a)[0];

    this.size = { columns: largestX + 1, rows: largestY + 1 };

    this.matrix = new Matrix(this.size, { defaultValue: '.' });

    points.forEach(([x,y]) => {
      this.matrix.set(y, x, "#");
    });
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

  get count() {
    return this.input.length;
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