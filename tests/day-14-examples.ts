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

const parse = (input: string) : [Template, Rule[]] => {
  const l = lines(input, { allowBlank: false });

  const template = { value: l[0] };

  const rules = l.slice(1).map(line => {
    const [pair, _, insertion] = line.split(' ');
    return {
      pair, insertion
    };
  });

  return [template, rules];
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
  })
});