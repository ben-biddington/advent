import { isLowerCase } from "core/text";

export class DefaultHistory implements History {
  private history: Map<string,number>;

  constructor(history: Map<string,number> | null = null) {
    this.history = history || new Map();
  }

  record(cave: string) {
    this.history.set(cave, (this.history.get(cave) || 0) + 1);
  }

  // Disallow any lowercase cave that is not start or end
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

export interface History {
  record: (cave: string) => void;
  allow: (cave: string) => boolean;
  clone: () => History;
}