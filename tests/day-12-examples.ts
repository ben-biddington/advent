import { expect } from "chai";
import { isLowerCase, lines } from "core/text";
import Path from "core/pathing/path";
import { Segment, Segments } from "core/pathing/segments";
import * as fs from 'fs';

const parse = (input: string) => {
  const paths: Segment[] = lines(input)
    .map(line => {
      const [start, end] = line.split('-');
      return { start, end };
    });
  
    return new Segments(paths);
}

describe('--- Day 12: Passage Pathing --- (part one)', () => {
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

    const result = path.follow('start');

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
      start,b,end`));
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
      start,kj,dc,end`));
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

describe('--- Day 12: Passage Pathing --- (part two)', () => {
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

    const path = new Path(parse(input), { loose: true });

    const result = path.follow('start');

    expect(result.length).to.eql(36);

    expect(result).to.have.members(lines(`
    start,A,b,A,b,A,c,A,end
    start,A,b,A,b,A,end
    start,A,b,A,b,end
    start,A,b,A,c,A,b,A,end
    start,A,b,A,c,A,b,end
    start,A,b,A,c,A,c,A,end
    start,A,b,A,c,A,end
    start,A,b,A,end
    start,A,b,d,b,A,c,A,end
    start,A,b,d,b,A,end
    start,A,b,d,b,end
    start,A,b,end
    start,A,c,A,b,A,b,A,end
    start,A,c,A,b,A,b,end
    start,A,c,A,b,A,c,A,end
    start,A,c,A,b,A,end
    start,A,c,A,b,d,b,A,end
    start,A,c,A,b,d,b,end
    start,A,c,A,b,end
    start,A,c,A,c,A,b,A,end
    start,A,c,A,c,A,b,end
    start,A,c,A,c,A,end
    start,A,c,A,end
    start,A,end
    start,b,A,b,A,c,A,end
    start,b,A,b,A,end
    start,b,A,b,end
    start,b,A,c,A,b,A,end
    start,b,A,c,A,b,end
    start,b,A,c,A,c,A,end
    start,b,A,c,A,end
    start,b,A,end
    start,b,d,b,A,c,A,end
    start,b,d,b,A,end
    start,b,d,b,end
    start,b,end`));
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

    const path = new Path(parse(input), { loose: true });

    expect(path.follow('start').length).to.eql(103);
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

    const path = new Path(parse(input), { loose: true });

    expect(path.follow('start').length).to.eql(3509);
  });

  it('The real example', () => {
    const input = fs.readFileSync('./input/twelve').toString();

    const path = new Path(parse(input), { loose: true });

    expect(path.follow('start').length).to.eql(96988);
  });
});