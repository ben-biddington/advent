export type Size = {
  rows: number;
  columns: number;
}

export type Position = {
  row: number;
  column: number;
}

export type Entry<T> = {
  postion: Position;
  value: T;
}

export type Options<T> = {
  defaultValue?: T;
}

export default class Matrix<T> {
  public readonly size: Size;
  private entries: T[][];

  constructor(size: Size, opts: Options<T> = {}) {
    this.size = size;
    this.entries = [];

    for (let rowIndex = 0; rowIndex < this.size.rows; rowIndex++) {
      const newRow: T[] = []; this.entries.push(newRow);

      for (let columnIndex = 0; columnIndex < this.size.columns; columnIndex++) {
        //@ts-ignore
        newRow.push(opts?.defaultValue);
      }
    }
  }

  add(entry: Entry<T>) {
    this.entries[entry.postion.row][entry.postion.column] = entry.value;
  }

  // https://www.math.net/matrix-notation
  at(i: number, j: number): T {
    return this.entries[i]?.[j];
  }

  // https://www.math.net/matrix-notation
  set(i: number, j: number, value: T) {
    this.entries[i][j] = value;
  }

  values(): T[] {
    return this.map(it => it.value);
  }

  report(fn: (entry: T) => string): string  {
    const values = this.values().map(fn);

    const lines: string[] = [];

    let index = 0;

    while (index < values.length) {
      const slice = values.slice(index, index + this.size.columns);

      lines.push(slice.join(''));

      index += this.size.columns;
    }

    return lines.join('\n'); 
  }

  neighbours(i: number, j: number): T[] {
    const self = this.at(i,j);

    if (self === undefined) // [i] Out of bounds
      return [];

    return [ 
      this.at(i - 1, j - 1),  this.at(i - 1, j)  , this.at(i - 1, j + 1),
      this.at(i, j - 1),this.at(i, j + 1),
      this.at(i + 1, j - 1),  this.at(i + 1, j)  , this.at(i + 1, j + 1),
    ]
    .filter(it => it !== undefined) as T[];
  }

  forEach(fn: (entry: Entry<T>) => void) {
    for (let row = 0; row < this.size.rows; row++) {
      for (let column = 0; column < this.size.columns; column++) {
        fn({
          postion: { row, column },
          value: this.at(row, column)
        })
      }
    }
  }

  map(fn: (entry: Entry<T>) => T) : T[] {
    const result: T[] = [];

    for (let row = 0; row < this.size.rows; row++) {
      for (let column = 0; column < this.size.columns; column++) {
        result.push(fn({
          postion: { row, column },
          value: this.at(row, column)
        }));
      }
    }

    return result;
  }

  splitAfterRow(rowIndex: number) : [Matrix<T>, Matrix<T>] {
    return [
      this.createFrom<T>(this.entries.slice(0, rowIndex + 1)),
      this.createFrom<T>(this.entries.slice(rowIndex + 1))
    ]
  }

  flip(axis: 'x'|'y'): Matrix<T> {
    if (axis === 'x') {
      const entries = [...this.entries].reverse();
      return this.createFrom<T>(entries);
    }

    throw new Error(`Flipping arond <${axis}> axis not yet supported`);
  }

  private createFrom<T>(entries: T[][]) : Matrix<T> {
    const result = new Matrix<T>({ rows: entries.length, columns: entries[0].length });
    result.entries = entries;
    return result;
  }
}