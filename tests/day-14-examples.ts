import { expect } from "chai";
import { sum } from "core/array-extensions";
import { lines } from "core/text";
import * as fs from 'fs';

type Template = {
  value: string
};

type Rule = {
  pair: string;
  insertion: string;
}

type LetterCount = {
  letter: string;
  count: number;
}

class Rules {
  private rules: Rule[] = [];
  
  constructor(rules: Rule[]) {
    this.rules = rules;
  }

  has(value: string) {
    return this.rules.some(it => it.pair === value);
  }

  get(value: string): string {
    return this.rules.filter(it => it.pair === value)[0].insertion;
  }

  at(index: number) {
    return this.rules.at(index);
  }

  public get length() {
    return this.rules.length;
  }
}

const parse = (input: string) : [Template, Rules] => {
  const l = lines(input, { allowBlank: false });

  const template = { value: l[0] };

  const rules = l.slice(1).map(line => {
    const [pair, _, insertion] = line.split(' ');
    return {
      pair, insertion
    };
  });

  return [template, new Rules(rules)];
}

class Polymer {
  private originalTemplate: string;
  private rules: Rules;
  private pairCounts = new Map<string,number>();
  private characterCounts = new Map<string,number>();

  constructor(templateText: string, rules: Rules) {
    this.originalTemplate = templateText;
    this.rules = rules;
    this.incrementPairs(templateText);
  }

  reset() {
    this.pairCounts.clear();
    this.incrementPairs(this.originalTemplate);
  }
  
  run(count: number): void {
    for (let index = 0; index < count; index++) {
      this.step();
    }
  }

  get length() {
    return sum(Array.from(this.pairCounts.values()))
  }

  mostCommon() : LetterCount {
    const sorted = this.sortCharacterCounts();

    return { letter: sorted[0][0], count: sorted[0][1] };
  }

  leastCommon() : LetterCount {
    const sorted = this.sortCharacterCounts();

    return { 
      letter: sorted[sorted.length -1][0], 
      count: sorted[sorted.length -1][1] 
    };
  }

  private sortCharacterCounts() {
    return Array.from(this.characterCounts.entries()).sort((a,b) => {
      const [_, countA]   = a;
      const [__, countB]  = b;

      return countB - countA;
    });
  }

  private step(): void {
    Array.from(this.pairCounts.keys()).forEach(pair => {
      if (this.rules.has(pair)) {
        const newValue = this.rules.get(pair);
        
        this.incrementPair(pair.slice(0,1) + newValue);
      }
    });
  }

  private incrementPairs(text: string) {
    for (let index = 0; index < text.length - 1; index++) {
      this.incrementPair(text.split('').slice(index, index + 2).join(''));
    }

    text.split('').forEach(this.incrementCharacter);
  }

  private incrementPair(pair: string) {
    if (pair) {
      this.pairCounts.set(pair, (this.pairCounts.get(pair) || 0) + 1);
    }
  }

  private incrementCharacter = (character: string) => {
    if (character) {
      this.characterCounts.set(character, (this.characterCounts.get(character) || 0) + 1);
    }
  }
}

describe.only('--- Day 14: Extended Polymerization --- (part one)', () => {
  it('parsing', () => {
    const input=`
    NNCB

    CH -> B
    HH -> N
    CB -> H
    NH -> C
    HB -> C
    HC -> B
    HN -> C
    NN -> C
    BH -> H
    NC -> B
    NB -> B
    BN -> B
    BB -> N
    BC -> B
    CC -> N
    CN -> C
    `

    const [template, rules] = parse(input);

    expect(template.value).to.eql('NNCB');
    expect(rules.length).to.eql(16);

    expect(rules.at(0)).to.eql( { pair: 'CH', insertion: 'B' });
    expect(rules.at(5)).to.eql( { pair: 'HC', insertion: 'B' });
    expect(rules.at(-1)).to.eql({ pair: 'CN', insertion: 'C' });
  });

  it('the basic example', () => {
    const input=`
    NNCB

    CH -> B
    HH -> N
    CB -> H
    NH -> C
    HB -> C
    HC -> B
    HN -> C
    NN -> C
    BH -> H
    NC -> B
    NB -> B
    BN -> B
    BB -> N
    BC -> B
    CC -> N
    CN -> C
    `

    const [template, rules] = parse(input);

    const polymer = new Polymer(template.value, rules);
    
    polymer.run(10);

    expect(polymer.length).to.eql(3073);

    expect(polymer.mostCommon()).to.eql({ letter: 'B', count: 1749 });
    expect(polymer.leastCommon()).to.eql({ letter: 'H', count: 161 });

    const result = polymer.mostCommon().count - polymer.leastCommon().count;
    
    expect(result).to.eql(1588);
  });

  it('the actual example', () => {

    const input = fs.readFileSync('./input/fourteen').toString();

    const [template, rules] = parse(input);

    const polymer = new Polymer(template.value, rules);

    polymer.run(10);

    const result = polymer.mostCommon().count - polymer.leastCommon().count;
    
    expect(result).to.eql(2068);
  });

  it.skip('part two', () => {

    const input = fs.readFileSync('./input/fourteen').toString();

    const [template, rules] = parse(input);

    const polymer = new Polymer(template.value, rules);

    polymer.run(40);

    const result = polymer.mostCommon().count - polymer.leastCommon().count;
    
    expect(result).to.eql(2068);
  });
});