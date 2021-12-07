import { expect } from "chai";
import { sum } from "core/array-extensions";
import * as fs from 'fs';

class School {
  private counts: Map<number,number> = new Map();

  constructor(fish: number[]) {
    fish.forEach(fish => {
      const count = this.counts.get(fish) || 0;
      this.counts.set(fish, count + 1);
    });
  }

  print() {
    return Array.from(this.counts.keys())
      .sort()
      .map(key => `${this.counts.get(key)}`)
      .join('\t');
  }

  tick(count = 1) {
    for (let index = 0; index < count; index++) {
      this.tickSingle();
    }
  }

  get total() {
    return sum(Array.from(this.counts.values()));
  }

  private tickSingle() {
    const reproducingCount = this.counts.get(0) || 0;
    
    [1,2,3,4,5,6,7,8].forEach(n => {
      const currentValue = this.counts.get(n) || 0;
      // shunt everything else down by one
      this.counts.set(n - 1, currentValue);
    });

    this.counts.set(8, reproducingCount);                               // new fish
    this.counts.set(6, reproducingCount + (this.counts.get(6) || 0));   // parents + what were there before
  }
}

const parse = (input: string): number[] => {
  return input.split(',').map(it => parseInt(it));
}

describe('--- Day 6: Lanternfish --- --- (part one)', () => {
  it(`How many lanternfish would there be after 2 days`, () => {
    const input = `3,4,3,1,2`

    const fish = parse(input);

    const school = new School(fish);
    
    school.tick(2);

    expect(school.total).to.eql(6);
  });

  it(`How many lanternfish would there be after 18 days`, () => {
    const input = `3,4,3,1,2`

    const fish = parse(input);

    const school = new School(fish);
    
    school.tick(18);

    expect(school.total).to.eql(26);
  });

  it(`How many lanternfish would there be after 80 days`, () => {
    const input = `3,4,3,1,2`

    const fish = parse(input);

    const school = new School(fish);
    
    school.tick(80);

    expect(school.total).to.eql(5934);
  });

  it(`How many lanternfish would there be after 256 days`, () => {
    const input = `3,4,3,1,2`

    const fish = parse(input);

    const school = new School(fish);
    
    school.tick(256);

    expect(school.total).to.eql(26984457539);
  });

  it(`Real example`, () => {
    const input = fs.readFileSync('./input/six').toString();

    const fish = parse(input);

    const school = new School(fish);
    
    school.tick(256);

    expect(school.total).to.eql(1728611055389);
  });
});