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
  private templateText: string;
  private originalTemplateText: string;
  private rules: Rules;

  constructor(templateText: string, rules: Rules) {
    this.templateText = templateText;
    this.originalTemplateText = templateText;
    this.rules = rules;
  }
  
  run(count: number): string {
    let result = this.templateText;

    for (let index = 0; index < count; index++) {
      result = this.step(result);
    }

    return this.templateText = result;
  }

  get length() {
    return this.templateText.length;
  }

  reset() {
    this.templateText = this.originalTemplateText;
  }

  mostCommon() : LetterCount {
    const counts = new Map<string,number>();

    for (let index = 0; index < this.templateText.length; index++) {
      const letter = this.templateText.slice(index, index + 1);
      counts.set(letter, (counts.get(letter) || 0) + 1);
    }

    const sorted = Array.from(counts.entries()).sort((a,b) => {
      const [_, countA] = a;
      const [__, countB] = b;

      return countB - countA;
    });

    return { letter: sorted[0][0], count: sorted[0][1] };
  }

  leastCommon() : LetterCount {
    const counts = new Map<string,number>();

    for (let index = 0; index < this.templateText.length; index++) {
      const letter = this.templateText.slice(index, index + 1);
      counts.set(letter, (counts.get(letter) || 0) + 1);
    }

    const sorted = Array.from(counts.entries()).sort((a,b) => {
      const [_, countA]   = a;
      const [__, countB]  = b;

      return countB - countA;
    });

    return { letter: sorted[sorted.length -1][0], count: sorted[sorted.length -1][1] };
  }

  private step(templateText: string) {
    const result = [];
  
    const template = templateText.split('');
  
    for (let index = 0; index < template.length - 1; index++) {
      const substring = template.slice(index, index + 2).join('');
      
      if (this.rules.has(substring)) {
        result.push(substring.slice(0, 1) + this.rules.get(substring));
      }
    }
  
    result.push(template.at(-1) || '');
  
    return result.join(''); 
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

    expect(polymer.run(4)).to.eql('NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB');

    polymer.reset();

    polymer.run(10);

    expect(polymer.length).to.eql(3073);

    expect(polymer.mostCommon()).to.eql({ letter: 'B', count: 1749 });
    expect(polymer.leastCommon()).to.eql({ letter: 'H', count: 161 });
  });
});