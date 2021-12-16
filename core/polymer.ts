export class Polymer {
  private originalTemplate: string;
  private rules: Rules;
  private pairCounts = new Map<string,number>();
  private characterCounts = new Map<string,number>();
  private log = (m: any) => {};

  constructor(templateText: string, rules: Rules, debug = false) {
    this.originalTemplate = templateText;
    this.rules = rules;
    this.incrementPairs(templateText);
    this.log = debug ? console.log : () => {};
  }

  reset() {
    this.pairCounts.clear();
    this.incrementPairs(this.originalTemplate);
  }
  
  run(count: number): void {
    this.log({ start: this.originalTemplate, rulesCount: this.rules.length })

    this.print();

    for (let index = 0; index < count; index++) {
      this.step();
      this.print();
    }
  }

  private step(): void {
    const next = new Map<string,number>();

    Array.from(this.pairCounts.entries()).forEach(entry => {
      const [pair, count] = entry;
      
      const [first, last] = pair.split('');

      const newCharacter = this.rules.get(pair);

      const newPairOne = `${first}${newCharacter}`;
      const newPairTwo = `${newCharacter}${last}`;

      next.set(newPairOne, (next.get(newPairOne) || 0) + count);
      next.set(newPairTwo, (next.get(newPairTwo) || 0) + count);

      this.incrementCharacterCount(newCharacter, count);
    });

    if (next.size < this.pairCounts.size)
      throw 'xxx';

    this.pairCounts = next;
  }

  incrementCharacterCount(character: string, count = 1) {
    this.characterCounts.set(character, (this.characterCounts.get(character) || 0) + count);
  }

  private print() {
    this.log(Array.from(this.pairCounts.entries()).map(entry => {
      const [a,b] = entry;
      return `${a}=${b}`;
    }));

    this.log(Array.from(this.characterCounts.entries()).map(entry => {
      const [a,b] = entry;
      return `${a}=${b}`;
    }));
  }

  mostCommon() : LetterCount {
    const mostCommonCharacter = this.sortCharacterCountsDesc()[0];

    return { letter: mostCommonCharacter[0], count: mostCommonCharacter[1] };
  }

  leastCommon() : LetterCount {
    const leastCommonCharacter = this.sortCharacterCountsDesc().at(-1) as [string, number];

    return { 
      letter: leastCommonCharacter[0], 
      count: leastCommonCharacter[1] 
    };
  }

  private sortCharacterCountsDesc() {
    return Array.from(this.characterCounts.entries()).sort((a,b) => {
      const [_  , countA]   = a;
      const [__ , countB]  = b;

      return countB - countA;
    });
  }

  private incrementPairs(text: string) {
    for (let index = 0; index < text.length - 1; index++) {
      const pair = text.split('').slice(index, index + 2).join('');
      
      this.pairCounts.set(pair, (this.pairCounts.get(pair) || 0) + 1);
    }

    const chars = text.split('');

    for (let index = 0; index < chars.length; index++) {
      const char = chars[index];

      this.characterCounts.set(char, (this.characterCounts.get(char) || 0) + 1);
    }
  }
}

export type Template = {
  value: string
};

export type Rule = {
  pair: string;
  insertion: string;
}

export type LetterCount = {
  letter: string;
  count: number;
}

export class Rules {
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