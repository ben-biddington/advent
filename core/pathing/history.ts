export class DefaultHistory implements History {
  private history: Map<string,number> = new Map();

  record(cave: string) {
    this.history.set(cave, (this.history.get(cave) || 0) + 1);
  }

  allow(cave: string) {
    console.log(this.caves);
    return false == this.caves.includes(cave);
  }

  private get caves() {
    return Array.from(this.history.keys());
  }
}

export interface History {
  record: (cave: string) => void;
  allow: (cave: string) => boolean;
}