import { expect } from "chai";
import { sum } from "core/array-extensions";
import { lines } from "core/internal/text";
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

describe.only('--- Day 10: Syntax Scoring ---', () => {
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