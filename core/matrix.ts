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
  private readonly size: Size;
  private readonly entries: T[][];

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
}