import { expect } from "chai";
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

class LanternFish {
  public timer: number = 0;

  constructor(timer: number) {
    this.timer = timer;
  }

  tick(): LanternFish | undefined {
    if (this.timer === 0) {
      this.timer = 6;
      return new LanternFish(8);
    }

    this.timer -= 1;
  }
}

class School {
  private fish: LanternFish[] = [];
  
  constructor(fish: LanternFish[]) {
    this.fish = fish;
  }

  tick(count = 1) {
    for (let index = 0; index < count; index++) {
      this.tickSingle();
    }
  }

  get total() {
    return this.fish.length;
  }

  private tickSingle() {
    const babies = this.fish.map(fish => fish.tick());

    babies.forEach(baby => {
      if (baby) {
        this.fish.push(baby)
      }
    });
  }

  report() {
    return this.fish.map(it => it.timer).join(',');
  }
}

const parse = (input: string): LanternFish[] => {
  return input.split(',').map(it => parseInt(it)).map(age => new LanternFish(age));
}

const count = (input: string, count = 1, pageSize = 32) => {
  const dirName = './tmp';

  if (fs.existsSync(dirName)) {
    fs.rmSync(dirName, { recursive: true, force: true });
  }

  fs.mkdirSync(dirName);

  fs.writeFileSync(path.join(dirName, uuidv4()), input);

  const limit = pageSize;
  const generations = count;

  const fullFileName = (fileName: string) => path.join(dirName, fileName);

  for (let index = 0; index < generations; index++) {
    const filesList = fs.readdirSync(dirName);
    
    filesList.forEach(fileName => {
      const school = new School(parse(fs.readFileSync(fullFileName(fileName)).toString()));

      school.tick();

      if (school.total > limit) {
        const all = school.report().split(',');

        const oldFileContents = all.slice(0, limit);
        const newFileContents = all.slice(limit);

        fs.writeFileSync(fullFileName(fileName), oldFileContents.join(','));
        fs.writeFileSync(fullFileName(uuidv4()), newFileContents.join(','));
      } else {
        fs.writeFileSync(fullFileName(fileName), school.report());
      }
    });
  }

  let total = 0;

  const filesList = fs.readdirSync(dirName);

  filesList.forEach(fileName => {
    total += new School(parse(fs.readFileSync(fullFileName(fileName)).toString())).total
  });

  return total;
}

describe('--- Day 6: Lanternfish --- --- (part one)', () => {
  it(`learning examples`, () => {
    const input = `3,4,3,1,2`

    const fish = parse(input);

    const school = new School(fish);
    
    expect(school.report()).to.eql('3,4,3,1,2');

    school.tick();

    expect(school.report()).to.eql('2,3,2,0,1');

    school.tick();

    expect(school.report()).to.eql('1,2,1,6,0,8');
  });

  it(`How many lanternfish would there be after 18 days`, () => {
    const input = `3,4,3,1,2`

    const fish = parse(input);

    const school = new School(fish);
    
    school.tick(18);

    expect(school.report()).to.eql('6,0,6,4,5,6,0,1,1,2,6,0,1,1,1,2,2,3,3,4,6,7,8,8,8,8');

    expect(school.total).to.eql(26);
  });

  it(`How many lanternfish would there be after 80 days`, () => {
    const input = `3,4,3,1,2`

    const fish = parse(input);

    const school = new School(fish);
    
    school.tick(80);

    expect(school.total).to.eql(5934);
  });

  // [!] FATAL ERROR: MarkCompactCollector: young object promotion failed Allocation failed - JavaScript heap out of memory
  //     try using just numbers?
  //     try storing in a file? Works better but still no good. Loading all into memory isn't going to work. 90MB file at last failed attempt.
  it.skip(`How many lanternfish would there be after 256 days`, () => {
    const input = `3,4,3,1,2`

    const fileName = './temp';

    fs.writeFileSync(fileName, input);

    const fish = parse(input);

    for (let index = 0; index < 256; index++) {
      const school = new School(parse(fs.readFileSync(fileName).toString()));
      school.tick();
      fs.writeFileSync(fileName, school.report());
    }

    const result = new School(parse(fs.readFileSync(fileName).toString())).total;

    expect(result).to.eql(26984457539);
  });

  // Works but is still too slow.
  it.only(`How many lanternfish would there be after 256 days (1)`, () => {
    const input = `3,4,3,1,2`

    expect(count(input, 18, 8)).to.eql(26);
    expect(count(input, 80, 32)).to.eql(5934);

    //expect(count(input, 256, 1024 * 1024)).to.eql(26984457539);
  });

  it(`Real example`, () => {
    const input = fs.readFileSync('./input/six').toString();

    const fish = parse(input);

    const school = new School(fish);
    
    school.tick(80);

    expect(school.total).to.eql(385391);
  });
});