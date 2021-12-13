import { isLowerCase } from "core/text";

export class DefaultHistory implements History {
  private history: Map<string,number>;

  constructor(history: Map<string,number> | null = null) {
    this.history = history || new Map();
  }

  record(cave: string) {
    this.history.set(cave, (this.history.get(cave) || 0) + 1);
  }

  allow = (cave: string) => {
    return cave == 'end' || false == this.caves
      .filter(isLowerCase)
      .includes(cave);
  }

  clone() {
    return new DefaultHistory(new Map(this.history));
  }

  private get caves() {
    return Array.from(this.history.keys());
  }
}

export class LooseHistory implements History {
  private history: Map<string,number>;

  constructor(history: Map<string,number> | null = null) {
    this.history = history || new Map();
  }

  record(cave: string) {
    this.history.set(cave, (this.history.get(cave) || 0) + 1);
  }

  allow = (cave: string) => {
    if (cave == 'end')
      return true;

    const smallCaves = this.caves.filter(isLowerCase); 

    if (false == smallCaves.includes(cave))
      return true;

    const smallCavesVisitedTwice = Array
      .from(this.history.keys())
      .filter(isLowerCase)
      .map(key => this.history.get(key))
      .filter(it => it && it > 1);

    if (smallCavesVisitedTwice.length == 0)
      return true;
      
    return false;
  }

  clone() {
    return new LooseHistory(new Map(this.history));
  }

  private get caves() {
    return Array.from(this.history.keys());
  }
}

export interface History {
  record: (cave: string) => void;
  allow: (cave: string) => boolean;
  clone: () => History;
}