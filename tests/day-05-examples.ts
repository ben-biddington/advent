import * as fs from 'fs';
import { expect } from 'chai';
import { lines } from 'core/internal/text';
import BingoGame from 'core/bingo/bingo-game';
import Board from 'core/bingo/board';

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

    return {
      start: parseCoordinates(start),
      end: parseCoordinates(end),
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
  const minX = Math.min(segment.start.x, segment.end.x);
  const maxX = Math.max(segment.start.x, segment.end.x);

  const minY = Math.min(segment.start.y, segment.end.y);
  const maxY = Math.max(segment.start.y, segment.end.y);

  const isWithinXRange = minX <= coords.x && coords.x <= maxX;
  const isWithinYRange = minY <= coords.y && coords.y <= maxY;

  return isWithinXRange && isWithinYRange;
}

const coverageDiagram = (segments: LineSegment[]) => {
  const horizontalOrVerticalLines = selectHorizontalOrVerticalLines(segments);
  const extent = findExtent(segments);

  const resultLines = [];

  for (let y = 0; y <= extent.y; y++) {
    const row = [];

    for (let x = 0; x <= extent.x; x++) {
      const coveringSegments = horizontalOrVerticalLines
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
  const horizontalOrVerticalLines = selectHorizontalOrVerticalLines(segments);
  const extent = findExtent(segments);

  let result = 0;

  for (let y = 0; y <= extent.y; y++) {
    for (let x = 0; x <= extent.x; x++) {
      const coveringSegments = horizontalOrVerticalLines
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

    const horizontalOrVerticalLines = selectHorizontalOrVerticalLines(segments);

    expect(horizontalOrVerticalLines.length).to.eql(6);

    //console.log(JSON.stringify(horizontalOrVerticalLines, null, 2));

    expect(findExtent(segments)).to.eql({x: 9, y: 9});

    expect(covers(segments[0], { x: 0, y: 9 })).to.be.true;
    expect(covers(segments[0], { x: 5, y: 9 })).to.be.true;
    expect(covers(segments[0], { x: 6, y: 9 })).to.be.false;

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

    const diagram = coverageDiagram(segments);

    expect(diagram).to.eql(expected.trim());

    expect(countOverlaps(segments)).to.eql(5);
  });

  it(`Real game`, () => {
    const input = fs.readFileSync('./input/five').toString();

    const segments = parse(input);

    expect(countOverlaps(segments)).to.eql(7269);
  });
});
