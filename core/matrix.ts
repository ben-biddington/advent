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

export default class Matrix<T> {
  private readonly size: Size;
  private readonly entries: T[][];

  constructor(size: Size) {
    this.size = size;
    this.entries = [];

    for (let rowIndex = 0; rowIndex < this.size.rows; rowIndex++) {
      const newRow: T[] = []; this.entries.push(newRow);

      for (let columnIndex = 0; columnIndex < this.size.columns; columnIndex++) {
        newRow.push();
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
}