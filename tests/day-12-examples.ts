import { expect } from "chai";
import { lines } from "core/internal/text";
import Matrix, { Size } from "core/matrix";
import * as fs from 'fs';
import { FlushValues } from "pako";

type Segment = { start: string; end: string; }

class Segments {
  private readonly paths: Segment[] = [];

  get count() {
    return this.paths.length;
  }

  startingAt(startNode: string): Segment[] {
    return this.paths.filter(it => it.start === startNode);
  }

  endingAt(startNode: string): Segment[] {
    return this.paths.filter(it => it.end === startNode);
  }

  constructor(paths: Segment[]) {
    this.paths.push(...paths);
  }
}

const parse = (input: string) => {
  const paths: Segment[] = lines(input)
    .map(line => {
      const [start, end] = line.split('-');
      return { start, end };
    });
  
    return new Segments(paths);
}

const isLowerCase = (value: string) => {
  const match = value.toLowerCase().match(new RegExp(`${value}`));

  return (match && match?.length > 0) || false;
}

class Path {
  private readonly segments: Segments;
  private progress: string[] = [];
  private smallCaves: string[] = [];
  private log: (m: any) => void = (m) => this._debug ? console.log(m) : () => {};
  private _debug: boolean = false;

  constructor(segments: Segments, progress: string[] = []) {
    this.segments = segments;
    this.progress = progress;
    this.smallCaves = progress.filter(isLowerCase);
  }

  debug() {
    this._debug = true;
  }

  follow(start: string) : string[] {
    this.progress.push(start);

    if (start === 'end') {
      return [this.progressReport()];
    }

    if (isLowerCase(start)) {
      this.smallCaves.push(start);
    }

    // [!] Can go backwards or forwards
    const allDestinations = [
      ...this.segments.startingAt(start).map(it => it.end), 
      ...this.segments.endingAt(start).map(it => it.start).filter(it => it != 'start')
    ];

    const nextAvailableCaves = allDestinations
      .filter(it  => false === this.smallCaves.includes(it));
    
    this.log({ 
      progress: this.progressReport(),
      current: start,
      'reverse-destinations': this.segments.endingAt(start).map(it => it.start).filter(it => it != 'start'),
      nextAvailableCaves
    });
  
    if (nextAvailableCaves.length === 0) {
      return []; // Never made it to 'end'
    }

    return nextAvailableCaves
      .map((cave) => {
        const path = new Path(this.segments, [...this.progress]); // [!] Copying progress very important!
        
        if (this._debug) {
          path.debug();
        }

        return path.follow(cave);
      }).flat();
  }

  private progressReport() {
    return this.progress.join(',');
  }
}

describe.only('--- Day 12: Passage Pathing --- (part one)', () => {
  it('The given example', () => {
    const input = `
    start-A
    start-b
    A-c
    A-b
    b-d
    A-end
    b-end
    `;

    // Your goal is to find the number of distinct paths that start at start, end at end, 
    // and don't visit small caves more than once. 
    //
    // There are two types of caves: 
    // 
    //  big caves (written in uppercase, like A) 
    //  and small caves (written in lowercase, like b).
    // 
    // It would be a waste of time to visit any small cave more than once, but big caves are large enough
    // that it might be worth visiting them multiple times. 
    //
    // So, all paths you find should visit small caves at most once, and can visit big caves any number of times.

    //     start
    //     /   \
    // c--A-----b--d
    //     \   /
    //      end

    const segments = parse(input);

    expect(segments.count).to.eql(7);
    expect(segments.startingAt('start')).to.eql(
      [ 
        { start: 'start', end: 'A' },
        { start: 'start', end: 'b' } ,
      ]);

    const path = new Path(segments);

    //path.debug();

    const result = path.follow('start');

    // Given these rules, there are 10 paths through this example cave system:

    expect(result.length).to.eql(10);

    expect(result).to.have.members(lines(`
start,A,b,A,c,A,end
start,A,b,A,end
start,A,b,end
start,A,c,A,b,A,end
start,A,c,A,b,end
start,A,c,A,end
start,A,end
start,b,A,c,A,end
start,b,A,end
start,b,end`))
  });

  it('The larger given example', () => {
    const input = `
    dc-end
    HN-start
    start-kj
    dc-start
    dc-HN
    LN-dc
    HN-end
    kj-sa
    kj-HN
    kj-dc
    `;

    const path = new Path(parse(input));

    expect(path.follow('start')).to.have.members(lines(`
    start,HN,dc,HN,end
    start,HN,dc,HN,kj,HN,end
    start,HN,dc,end
    start,HN,dc,kj,HN,end
    start,HN,end
    start,HN,kj,HN,dc,HN,end
    start,HN,kj,HN,dc,end
    start,HN,kj,HN,end
    start,HN,kj,dc,HN,end
    start,HN,kj,dc,end
    start,dc,HN,end
    start,dc,HN,kj,HN,end
    start,dc,end
    start,dc,kj,HN,end
    start,kj,HN,dc,HN,end
    start,kj,HN,dc,end
    start,kj,HN,end
    start,kj,dc,HN,end
    start,kj,dc,end`))
  });

  it('The even larger given example', () => {
    const input = `
    fs-end
    he-DX
    fs-he
    start-DX
    pj-DX
    end-zg
    zg-sl
    zg-pj
    pj-he
    RW-he
    fs-DX
    pj-RW
    zg-RW
    start-pj
    he-WI
    zg-he
    pj-fs
    start-RW
    `;

    const path = new Path(parse(input));

    expect(path.follow('start').length).to.eql(226);
  });

  it('The real example', () => {
    const input = fs.readFileSync('./input/twelve').toString();

    const path = new Path(parse(input));

    expect(path.follow('start').length).to.eql(3779);
  });

  it('lowercase checking', () => {
    expect(isLowerCase('a')).to.be.true;
    expect(isLowerCase('ab')).to.be.true;
    expect(isLowerCase('A')).to.be.false;
  });
});