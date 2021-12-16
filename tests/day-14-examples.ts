import { expect } from "chai";
import { Template, Rules, Polymer } from "core/polymer";
import { lines } from "core/text";
import * as fs from 'fs';

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


describe('--- Day 14: Extended Polymerization --- (part one)', () => {
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

    expect(polymer.mostCommon()).to.eql({ letter: 'B', count: 1749 });
    expect(polymer.leastCommon()).to.eql({ letter: 'H', count: 161 });

    const result = polymer.mostCommon().count - polymer.leastCommon().count;
    
    expect(result).to.eql(1588);
  });

  it('the actual example', () => {

    const input = fs.readFileSync('./input/fourteen').toString();

    const [template, rules] = parse(input);

    const polymer = new Polymer(template.value, rules);

    expect(template.value).to.eql('KFFNFNNBCNOBCNPFVKCP');
    expect(rules.at(0)).to.eql({ pair: 'PB', insertion: 'F'});
    expect(rules.at(-1)).to.eql({ pair: 'SF', insertion: 'H'});

    polymer.run(10);

    const result = polymer.mostCommon().count - polymer.leastCommon().count;
    
    expect(result).to.eql(2068);
  });

  it('part two', () => {

    const input = fs.readFileSync('./input/fourteen').toString();

    const [template, rules] = parse(input);

    const polymer = new Polymer(template.value, rules);

    polymer.run(40);

    const result = polymer.mostCommon().count - polymer.leastCommon().count;
    
    expect(result).to.eql(2068);
  });
});