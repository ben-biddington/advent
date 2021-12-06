import { expect } from "chai";

class LanternFish {
  private age: number = 0;

  constructor(age: number) {

  }
}

const parse = (input: string): LanternFish[] => {
  return input.split(',').map(it => parseInt(it)).map(age => new LanternFish(age));
}

describe('--- Day 6: Lanternfish --- --- (part one)', () => {
  it(` How many lanternfish would there be after 80 days?`, () => {
    const input = `3,4,3,1,2`

    const fish = parse(input);

    expect(fish.length).to.eql(5);
  });
});