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

  map<TRESULT>(fn: (entry: Entry<T>) => TRESULT) : TRESULT[] {
    const result: TRESULT[] = [];

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

  splitAfterColumn(columnIndex: number) : [Matrix<T>, Matrix<T>] {
    const leftSize  = {...this.size, columns: columnIndex + 1};
    const rightSize = {...this.size, columns: this.size.columns - leftSize.columns};

    const entriesLeft: T[][] = this.newBlank(leftSize);

    for (let row = 0; row < leftSize.rows; row++) {
      for (let column = 0; column <= columnIndex; column++) {
        entriesLeft[row][column] = this.at(row, column);
      }
    }

    const entriesRight: T[][] = this.newBlank(rightSize);

    for (let row = 0; row < rightSize.rows; row++) {
      for (let column = columnIndex; column < rightSize.columns + 1; column++) {
        entriesRight[row][column - leftSize.columns + 1] = this.at(row, column + columnIndex);
      }
    }
    
    return [
      this.createFrom<T>(entriesLeft),
      this.createFrom<T>(entriesRight)
    ]
  }

  flip(axis: 'x'|'y'): Matrix<T> {
    if (axis === 'x') {
      return this.createFrom<T>([...this.entries].reverse());
    } else if (axis === 'y') {
      return this.createFrom<T>([...this.entries].map(row => [...row].reverse()));
    }

    throw new Error(`Flipping arond <${axis}> axis not yet supported`);
  }

  merge(other: Matrix<T>, operator: ((a: T, b: T) => T)) {
    const rows = [...this.entries];

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.size.columns; columnIndex++) {
        rows[rowIndex][columnIndex] = operator(this.at(rowIndex, columnIndex), other.at(rowIndex, columnIndex));
      }
    }

    return this.createFrom(rows);
  }

  withoutRow(index: number) {
    return this.createFrom([...this.entries].filter((_, i) => i != index));
  }

  withoutColumn(index: number) {
    return this.createFrom([...this.entries].map(row => {
      return [...row].filter((_, i) => i != index)
    }));
  }

  private createFrom<T>(entries: T[][]) : Matrix<T> {
    const result = new Matrix<T>({ rows: entries.length, columns: entries[0].length });
    result.entries = entries;
    return result;
  }

  private newBlank(size: Size, defaultValue = undefined) {
    const result: T[][] = [];

    for (let rowIndex = 0; rowIndex < size.rows; rowIndex++) {
      const newRow: T[] = []; result.push(newRow);

      for (let columnIndex = 0; columnIndex < size.columns; columnIndex++) {
        //@ts-ignore
        newRow.push(defaultValue);
      }
    }

    return result;
  }
}