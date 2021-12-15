import { expect } from "chai";
import { parse as parseOrigami, Origami, Instructions, Fold } from "core/origami/origami";
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
  private originalTemplate: string[];
  private rules: Rules;
  private counts = new Map<string,number>();
  private pairCounts = new Map<string,number>();
  private value: string[];

  constructor(templateText: string, rules: Rules) {
    this.value = templateText.split('');
    this.originalTemplate = [...this.value];
    this.rules = rules;
    this.increment(this.value);
  }
  
  run(count: number): void {
    let result = this.value;

    for (let index = 0; index < count; index++) {
      result = this.step(result);
      console.log({index, length: result.length});
    }

    this.value = result
  }

  get length() {
    return this.value.length;
  }

  toString() {
    return this.value.join('');
  }

  reset() {
    this.counts.clear();
    this.increment(this.originalTemplate);
    this.value = [...this.originalTemplate]
  }

  mostCommon() : LetterCount {
    const sorted = Array.from(this.counts.entries()).sort((a,b) => {
      const [_, countA] = a;
      const [__, countB] = b;

      return countB - countA;
    });

    return { letter: sorted[0][0], count: sorted[0][1] };
  }

  leastCommon() : LetterCount {
    const sorted = Array.from(this.counts.entries()).sort((a,b) => {
      const [_, countA]   = a;
      const [__, countB]  = b;

      return countB - countA;
    });

    return { 
      letter: sorted[sorted.length -1][0], 
      count: sorted[sorted.length -1][1] 
    };
  }

  private step(template: string[]): string[] {
    const result = [];
  
    for (let index = 0; index < template.length - 1; index++) {
      const substring = template.slice(index, index + 2).join('');

      if (this.rules.has(substring)) {
        const nextLetter = this.rules.get(substring);

        this.increment([nextLetter]);

        result.push(substring.slice(0, 1), nextLetter);
      }
    }
  
    result.push(template.at(-1) || ''); // [i] Final letter already counted
  
    return result;
  }

  private increment(letters: string[]) {
    letters.forEach(letter => {
      this.counts.set(letter, (this.counts.get(letter) || 0) + 1);
    });
  }
}

describe('--- Day 14: Extended Polymerization --- (part one)', () => {
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
    
    polymer.run(4);

    expect(polymer.toString()).to.eql('NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB');

    polymer.reset();

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