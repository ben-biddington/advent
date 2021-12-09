import { expect } from "chai";
import { range, sum } from "core/array-extensions";
import { lines } from "core/internal/text";
import * as fs from 'fs';

// 0:      1:      2:      3:      4:
//  aaaa    ....    aaaa    aaaa    ....
// b    c  .    c  .    c  .    c  b    c
// b    c  .    c  .    c  .    c  b    c
//  ....    ....    dddd    dddd    dddd
// e    f  .    f  e    .  .    f  .    f
// e    f  .    f  e    .  .    f  .    f
//  gggg    ....    gggg    gggg    ....

//   5:      6:      7:      8:      9:
//  aaaa    aaaa    aaaa    aaaa    aaaa
// b    .  b    .  .    c  b    c  b    c
// b    .  b    .  .    c  b    c  b    c
//  dddd    dddd    ....    dddd    dddd
// .    f  e    f  .    f  e    f  .    f
// .    f  e    f  .    f  e    f  .    f
//  gggg    gggg    ....    gggg    gggg

type Sample = { input: string[], output: string[] }

// The digits 1, 4, 7, and 8 each use a unique number of segments.
// Returns all digits in the output  1, 4, 7, or 8 seg.ments
const uniqueSegmentsInOuput = (input: string) => {
  const samples: Sample[] = lines(input)
    .map(line => 
      {
        var parts = line.split('|');

        return { 
          input: parts[0].trim().split(' '), 
          output: parts[1].trim().split(' ') };
      });

  return samples
    .map(it => it.output)
    .flat()
    .filter(it => [ 2, 4, 3, 7 ].includes(it.length));
}

describe('--- Day 8: Seven Segment Search ---', () => {
  it('The given example', () => {
    const input = `
    be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
    edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
    fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
    fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
    aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
    fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
    dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
    bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
    egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
    gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce
    `;

    const result = uniqueSegmentsInOuput(input);

    expect(result.length).to.eql(26);
  });

  it('The real example', () => {
    const input = fs.readFileSync('./input/eight').toString();

    const result = uniqueSegmentsInOuput(input);

    expect(result.length).to.eql(473);
  });
});