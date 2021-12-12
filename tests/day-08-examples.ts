import { expect } from "chai";
import { sum } from "core/array-extensions";
import { lines } from "core/text";
import * as fs from 'fs';
// The digits 1, 4, 7, and 8 each use a unique number of segments

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

const parse = (line: string) => {
  var parts = line.split('|');

  return { 
    input: parts[0].trim().split(' '), 
    output: parts[1].trim().split(' ') };
}

const sort = (text: string) => text.split('').sort().join('');

const uniq = (...args: (string | undefined)[]): string[] => {
  const all = args.filter(it => it !== undefined).join('');

  return all.split('').filter((value: string, index: number, self: string[]) => { 
    return self.indexOf(value) === index;
  });
}

const includesAllCharacters = (text: string, characters: string) => {
  return characters.split('').filter(it => text.includes(it)).length === characters.length;
}

const solve = (line: string) => {
  const get = calculate(line);

  return parse(line).output.map(it => get(it) || 0).join('');
}

const calculate = (input: string): (value: string) => number => {
  // The digits 1, 4, 7, and 8 each use a unique number of segments.

  const mapping = new Map<number,string>(); // Actual digits to segment combinations
  
  const sample = parse(input);

  mapping.set(1, sample.input.filter(it => it.length == 2)[0]);
  mapping.set(4, sample.input.filter(it => it.length == 4)[0]);
  mapping.set(7, sample.input.filter(it => it.length == 3)[0]);
  mapping.set(8, sample.input.filter(it => it.length == 7)[0]);

  const onlyRemainingUnknowns = (): string[] => {
    const currentValues = Array.from(mapping.values());
    
    return sample.input.filter(it => false == currentValues.includes(it));
  };

  //
  // Nine is a seven plus a four
  //
  const nine = onlyRemainingUnknowns()
    .filter(it => {
      const sevenAndFour = uniq(mapping.get(7), mapping.get(4)).join('');
      return includesAllCharacters(it, sevenAndFour);
    })[0];
  
  mapping.set(9, nine);

  //
  // Three has five segments inside a nine and contains one
  //
  const three = onlyRemainingUnknowns()
    .filter(it => it.length === 5)
    .filter(it => {
      const nine = uniq(mapping.get(9)).join('');
      return includesAllCharacters(nine, it) && includesAllCharacters(it, mapping.get(1) || '');
    })[0];

  mapping.set(3, three);

  //
  // Zero contains all of one
  //
  const zero = onlyRemainingUnknowns()
    .filter(it => it.length === 6)
    .filter(it => {
      return includesAllCharacters(it, mapping.get(1) || '');
    })[0];

  mapping.set(0, zero);

  //
  // Six is the only remaining one with 6 segments
  //
  mapping.set(6, onlyRemainingUnknowns().filter(it => it.length === 6)[0]);

  //
  // Five is contained by nine
  //
  mapping.set(5, 
    onlyRemainingUnknowns()
      .filter(it => includesAllCharacters(mapping.get(9) || '', it))[0]);

  //
  // Two is the only one left with 5 segments
  //
  mapping.set(2, onlyRemainingUnknowns()
    .filter(it => it.length === 5)[0]);
  
  var reverse = new Map<string,number>();

  Array.from(mapping.keys()).forEach(number => {
    reverse.set(sort(mapping.get(number) || ''), number);
  });

  return (value: string) => {
    value = sort(value);
    
    const result = reverse.get(value);

    if (result === undefined)
      throw new Error(`Failed to find <${value}>. Have these keys <${Array.from(reverse.keys())}>`);

      return result;
  }
}

// The digits 1, 4, 7, and 8 each use a unique number of segments.
// Returns all digits in the output  1, 4, 7, or 8 seg.ments
const uniqueSegmentsInOuput = (input: string) => {
  const samples: Sample[] = lines(input).map(parse);

  return samples
    .map(it => it.output)
    .flat()
    .filter(it => [ 2, 4, 3, 7 ].includes(it.length));
}

describe('--- Day 8: Seven Segment Search --- (part one)', () => {
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

describe('--- Day 8: Seven Segment Search --- (part two)', () => {
  it('The given example', () => {
    const line = 'acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf';
    
    const get = calculate(line);

    expect(get('cdfbe')).to.eql(5);
    expect(get('cefabd')).to.eql(9);
    expect(get('gcdfa')).to.eql(2);
    expect(get('cdfgeb')).to.eql(6);
    expect(get('cagedb')).to.eql(0);
    expect(get('ab')).to.eql(1);
    expect(get('fbcad')).to.eql(3);
    expect(get('eafb')).to.eql(4);
    expect(get('dab')).to.eql(7);
    expect(get('acedgfb')).to.eql(8);

    expect(parse(line).output.map(it => get(it) || 0).join('')).to.eql('5353');

    expect(solve('be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe'))
      .to.eql('8394');
    
    expect(solve('edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc'))
      .to.eql('9781');
    
    expect(solve('fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg'))
      .to.eql('1197');
    
    expect(solve('fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb'))
      .to.eql('9361');

    expect(solve('aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea'))
      .to.eql('4873');

    expect(solve('fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb'))
      .to.eql('8418');

    expect(solve('dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe'))
      .to.eql('4548');

    expect(solve('bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef'))
      .to.eql('1625');

    expect(solve('egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb'))
      .to.eql('8717');

    expect(solve('gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce'))
      .to.eql('4315');
  });

  it('calculating the sum', () => {
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

    const values = lines(input).map(it => it.trim()).map(solve);

    expect(sum(values.map(it => parseInt(it)))).to.eql(61229);
  })

  it('The real example', () => {
    const input = fs.readFileSync('./input/eight').toString();

    const values = lines(input).map(it => it.trim()).map(solve);

    expect(sum(values.map(it => parseInt(it)))).to.eql(1097568);
  });
});