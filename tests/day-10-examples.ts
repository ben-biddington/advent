import { expect } from "chai";
import { sum } from "core/array-extensions";
import { lines } from "core/text";
import * as fs from 'fs';

type Token = {
  opening: string;
  closing: string;
}

class Tokens {
  private readonly tokens: Token[] = [];

  constructor() {
    this.tokens = [ '()', '<>', '[]', '{}' ]
      .map(it => {
        return { opening: it[0], closing: it[1] } 
      })
  }

  isOpening   = (token: string) => this.tokens.map(it => it.opening).includes(token);
  closingFor  = (token: string) => this.tokens.filter(it => it.opening === token)?.[0]?.closing;
  openingFor  = (token: string) => this.tokens.filter(it => it.closing === token)?.[0]?.opening;
}

const parse = (input: string) => {
  const tokens = new Tokens();

  const openingTokens: string[] = [];

  input.split('')
    .map(it => it.trim())
    .filter(it => it.length > 0)
    .forEach((token, index) => {
    if (tokens.isOpening(token)) {
      openingTokens.push(token);
    } else {
      
      const openingToken = openingTokens.pop();

      // @ts-ignore
      const expectedClosingToken = tokens.closingFor(openingToken);
      
      if (expectedClosingToken === undefined)
        throw new Error(`Failed to find closing token for opening token '${token}'`);

      if (token != expectedClosingToken)
        throw new Error(`Expected ${expectedClosingToken}, but found ${token} instead. Error at index <${index}>.`);
    }
  })
}

const firstIllegal = (input: string) => {
  const tokens = new Tokens();

  const openingTokens: string[] = [];

  return input.split('')
    .map(it => it.trim())
    .filter(it => it.length > 0)
    .map((token) => {
      if (tokens.isOpening(token)) {
        openingTokens.push(token);
      } else {
        
        const openingToken = openingTokens.pop();

        // @ts-ignore
        const expectedClosingToken = tokens.closingFor(openingToken);
        
        if (token != expectedClosingToken)
          return token;
      }
  })
  .filter(it => it !== undefined)
  .flat()[0];
}

const score = (characters: string []) => {
  // ): 3 points.
  // ]: 57 points.
  // }: 1197 points.
  // >: 25137 points.
  return sum([
    characters.filter(it => it == ')').length * 3,
    characters.filter(it => it == ']').length * 57,
    characters.filter(it => it == '}').length * 1197,
    characters.filter(it => it == '>').length * 25137,
  ]);
}

describe('--- Day 10: Syntax Scoring --- (part one)', () => {
  it('abc', () => {
    expect(() => parse('{([(<{}[<>[]}>{[]{[(<()>')).to.throw('Expected ], but found } instead.');
    expect(() => parse('[[<[([]))<([[{}[[()]]]')  ).to.throw('Expected ], but found ) instead');
    expect(() => parse('[{[{({}]{}}([{[{{{}}([]') ).to.throw('Expected ), but found ] instead');
    expect(() => parse('[<(<(<(<{}))><([]([]()')  ).to.throw('Expected >, but found ) instead');
    expect(() => parse('<{([([[(<>()){}]>(<<{{')  ).to.throw('Expected ], but found > instead');

    expect(firstIllegal('{([(<{}[<>[]}>{[]{[(<()>')).to.eql('}');
  });

  it('Count illegal characters', () => {
    const input = `
      [({(<(())[]>[[{[]{<()<>>
      [(()[<>])]({[<{<<[]>>(
      {([(<{}[<>[]}>{[]{[(<()>
      (((({<>}<{<{<>}{[]{[]{}
      [[<[([]))<([[{}[[()]]]
      [{[{({}]{}}([{[{{{}}([]
      {<[[]]>}<{[{[{[]{()[[[]
      [<(<(<(<{}))><([]([]()
      <{([([[(<>()){}]>(<<{{
      <{([{{}}[<[[[<>{}]]]>[]]`;

    const errors = lines(input).map(line => firstIllegal(line)).filter(it => it !== undefined);

    //@ts-ignore
    expect(score(errors)).to.eql(26397);
  });

  it('The real example', () => {
    const input = fs.readFileSync('./input/ten').toString();

    const errors = lines(input).map(line => firstIllegal(line)).filter(it => it !== undefined);

    //@ts-ignore
    expect(score(errors)).to.eql(392043);
  });
});

const middleCompletionScore = (input: string): number => {
  const completions = scoreCompletions(input).sort((a,b) => a - b);
  const middleIndex = Math.round(completions.length/2) - 1;
  
  return completions[middleIndex];
}

const scoreCompletions = (input: string): number[] => {
  const lines       = incompleteLines(input);
  const completions = lines.map(complete);

  return completions.map(scoreCompletion);
}

// The score is determined by considering the completion string character-by-character. 
// Start with a total score of 0. 
// Then, for each character, 
// 
//  multiply the total score by 5 and then increase the total score by the point value given for the character
//  in the following table:
//
//     ): 1 point.
//     ]: 2 points.
//     }: 3 points.
//     >: 4 points.
//
const scoreCompletion = (completion: string) => {
  const scores = new Map<string,number>([
    [ ')', 1],
    [ ']', 2],
    [ '}', 3],
    [ '>', 4]
  ]);

  const tokens = completion.split('');

  return tokens.reduce((previous, current, index) => {
    return (previous * 5) + (scores.get(tokens[index]) || 0)
  }, 0);
}

// Assume NO illegal characters
const complete = (input: string | undefined) => {
  const tokens = new Tokens();

  const openingTokens: string[] = [];

  (input || '').split('')
    .map(it => it.trim())
    .filter(it => it.length > 0)
    .forEach((token) => {
      if (tokens.isOpening(token)) {
        openingTokens.push(token);
      } else {
        const lastOpeningToken = openingTokens[openingTokens.length - 1]; 
        const expectedOpening  = tokens.openingFor(token);

        if (expectedOpening === lastOpeningToken) {
          openingTokens.pop();
        }
      }
  });

  return openingTokens.map(tokens.closingFor).reverse().join('');
}

const incompleteLines = (input: string) => {
  return lines(input).map(line => {
    return firstIllegal(line) === undefined ? line : undefined;
  }).filter(it => it !== undefined);
}

describe('--- Day 10: Syntax Scoring --- (part two)', () => {
  it('Find completion sequence', () => {
    const input = `
      [({(<(())[]>[[{[]{<()<>>
      [(()[<>])]({[<{<<[]>>(
      {([(<{}[<>[]}>{[]{[(<()>
      (((({<>}<{<{<>}{[]{[]{}
      [[<[([]))<([[{}[[()]]]
      [{[{({}]{}}([{[{{{}}([]
      {<[[]]>}<{[{[{[]{()[[[]
      [<(<(<(<{}))><([]([]()
      <{([([[(<>()){}]>(<<{{
      <{([{{}}[<[[[<>{}]]]>[]]`;

    expect(middleCompletionScore(input)).to.eql(288957);
  });

  it('The real example', () => {
    const input = fs.readFileSync('./input/ten').toString();

    expect(middleCompletionScore(input)).to.eql(1605968119);
  });
});