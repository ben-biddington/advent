import * as fs from 'fs';
import { expect } from 'chai';
import { lines } from 'core/internal/text';

type Coordinates = {
  x: number;
  y: number;
}

type LineSegment = {
  start: Coordinates;
  end: Coordinates;
}

const parse = (input: string) : LineSegment[] => {
  const parseCoordinates = (text: string): Coordinates => {
    const [x,y] = text.split(',');
    return { x: parseInt(x), y: parseInt(y) };
  }

  return lines(input).map((startAndEnd: string) => {
    const [start, end] = startAndEnd.split('->');

    const first = parseCoordinates(start); 
    const last  = parseCoordinates(end); 

    // [i] always arrange with smallest x value first
    if (first.x < last.x) {
      return {
        start: first,
        end: last,
      }
    } else {
      return {
        start: last,
        end: first,
      }
    }
  });
}

const selectHorizontalOrVerticalLines = (segments: LineSegment[]) => {
  return segments.filter(segment => segment.start.x == segment.end.x || segment.start.y == segment.end.y)
}

const findExtent = (segments: LineSegment[]) : Coordinates => {
  const largestX = segments
    .map(segment            => Math.max(segment.start.x, segment.end.x))
    .reduce((current, next) => Math.max(current, next), 0);

  const largestY = segments
    .map(segment            => Math.max(segment.start.y, segment.end.y))
    .reduce((current, next) => Math.max(current, next), 0);
  
  return {
    x: largestX,
    y: largestY
  }
}

const covers = (segment: LineSegment, coords: Coordinates) => {
  return includes(segment, coords);
}

const isWithinRange = (segment: LineSegment, coords: Coordinates) => {
  const [minX, maxX] = [ Math.min(segment.start.x, segment.end.x), Math.max(segment.start.x, segment.end.x)];
  const [minY, maxY] = [ Math.min(segment.start.y, segment.end.y), Math.max(segment.start.y, segment.end.y)];

  const result = (minX <= coords.x && coords.x <= maxX) && (minY <= coords.y && coords.y <= maxY);

  return result;
}

// Tell me if segment include point
const includes = (segment: LineSegment, coords: Coordinates): boolean => {
  if (false == isWithinRange(segment, coords))
    return false;

  const rise = segment.end.y - segment.start.y;
  const run  = segment.end.x - segment.start.x;

  if (rise === 0) {
    // Horizontal line
    return coords.y === segment.start.y;
  }

  if (run === 0) {
    // Vertical line
    return coords.x === segment.start.x;
  }

  const slope = rise/run;

  const startPoint  = segment.start.x < segment.end.x ? segment.start : segment.end;

  let x = startPoint.x;
  let y = startPoint.y;
  
  while (x > 0) {
    y -= slope; // [i] *reduce* y as we're finding the intercept
    x -= 1;
  }

  const fn = (x: number) => slope*x + y;

  return fn(coords.x) === coords.y;
}

const coverageDiagram = (segments: LineSegment[]) => {
  const extent = findExtent(segments);

  const resultLines = [];

  for (let y = 0; y <= extent.y; y++) {
    const row = [];

    for (let x = 0; x <= extent.x; x++) {
      const coveringSegments = segments
        .filter(segment => covers(segment, { x, y }));

      if (coveringSegments.length > 0) {
        row.push(coveringSegments.length.toString());
      } else {
        row.push('.');
      }
    }

    resultLines.push(row.join(''));
  }

  return resultLines.join('\n');
}

const countOverlaps = (segments: LineSegment[]): number => {
  const extent = findExtent(segments);

  let result = 0;

  for (let y = 0; y <= extent.y; y++) {
    for (let x = 0; x <= extent.x; x++) {
      const coveringSegments = segments
        .filter(segment => covers(segment, { x, y }));

      if (coveringSegments.length >= 2) {
        result++
      }
    }
  }

  return result;
}

describe('--- Day 5: Hydrothermal Venture --- (part one)', () => {
  it(`determine the number of points where at least two lines overlap`, () => {
    const input = `
      0,9 -> 5,9
      8,0 -> 0,8
      9,4 -> 3,4
      2,2 -> 2,1
      7,0 -> 7,4
      6,4 -> 2,0
      0,9 -> 2,9
      3,4 -> 1,4
      0,0 -> 8,8
      5,5 -> 8,2
    `

    const segments = parse(input);

    expect(segments[0]).to.eql(
      {
        start: { x: 0, y: 9 }, end: { x: 5, y: 9 }
      }
    )

    expect(segments[segments.length - 1]).to.eql(
      {
        start: { x: 5, y: 5 }, end: { x: 8, y: 2 }
      }
    )

    const expected = `
.......1..
..1....1..
..1....1..
.......1..
.112111211
..........
..........
..........
..........
222111....
    `

    const horizontalOrVerticalSegments = selectHorizontalOrVerticalLines(segments);

    const diagram = coverageDiagram(selectHorizontalOrVerticalLines(horizontalOrVerticalSegments));

    expect(diagram).to.eql(expected.trim());

    expect(countOverlaps(horizontalOrVerticalSegments)).to.eql(5);
  });

  it(`Real game`, () => {
    const input = fs.readFileSync('./input/five').toString();

    const segments = parse(input);

    expect(countOverlaps(selectHorizontalOrVerticalLines(segments))).to.eql(7269);
  });
});

describe('--- Day 5: Hydrothermal Venture --- (part two)', () => {
  it(`include diagonals`, () => {
    const input = `
      0,9 -> 5,9
      8,0 -> 0,8
      9,4 -> 3,4
      2,2 -> 2,1
      7,0 -> 7,4
      6,4 -> 2,0
      0,9 -> 2,9
      3,4 -> 1,4
      0,0 -> 8,8
      5,5 -> 8,2
    `

    const segments = parse(input);

    const expected = `
1.1....11.
.111...2..
..2.1.111.
...1.2.2..
.112313211
...1.2....
..1...1...
.1.....1..
1.......1.
222111....
`
    const diagram = coverageDiagram(segments);

    expect(diagram).to.eql(expected.trim());

    expect(countOverlaps(segments)).to.eql(12);
  });

  it(`Real game`, () => {
    const input = fs.readFileSync('./input/five').toString();

    const segments = parse(input);

    expect(countOverlaps(segments)).to.eql(21140);
  });
});
