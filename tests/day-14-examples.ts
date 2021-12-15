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

const step = (templateText: string, rules: Rules) => {
  const result = [];

  const template = templateText.split('');

  for (let index = 0; index < template.length - 1; index++) {
    const substring = template.slice(index, index + 2).join('');
    
    if (rules.has(substring)) {
      result.push(substring.slice(0, 1) + rules.get(substring));
    }
  }

  result.push(template.at(-1) || '');

  return result.join(''); 
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

    const one   = step(template.value, rules);
    const two   = step(one, rules);
    const three = step(two, rules);
    const four  = step(three, rules);

    expect(one  ).to.eql('NCNBCHB');
    expect(two  ).to.eql('NBCCNBBBCBHCB');
    expect(three).to.eql('NBBBCNCCNBBNBNBBCHBHHBCHB');
    expect(four ).to.eql('NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB');
  });
});