import { isLowerCase } from "core/text";

export enum Mode {
  Default = 0,
  Loose = 1
}

export class BasicHistory implements History {
  private history: Map<string,number>;
  private progress: string[] = [];
  private mode: Mode;

  constructor(mode: Mode, history: Map<string,number> | null = null, progress: string[] | null = null) {
    this.mode = mode;
    this.history = history || new Map();
    this.progress = progress || [];
  }

  record(cave: string) {
    this.progress.push(cave);
    this.history.set(cave, (this.history.get(cave) || 0) + 1);
  }

  allow = (cave: string) => {
    return this.mode === Mode.Loose ? this.loose(cave): this.default(cave);
  }

  private default(cave: string) : boolean {
    return false == this.smallCaves.includes(cave);
  }

  private loose(cave: string) {
    if (false == this.smallCaves.includes(cave))
      return true;

    const smallCavesVisitedTwice = this.smallCaves
      .map(key => this.history.get(key))
      .filter(it => it && it > 1);

    return smallCavesVisitedTwice.length == 0;
  }

  clone() {
    return new BasicHistory(this.mode, new Map(this.history), [...this.progress]);
  }

  list() {
    return [...this.progress];
  }

  private get smallCaves() {
    return this.caves.filter(isLowerCase);
  }

  private get caves() {
    return Array.from(this.history.keys());
  }
}

export interface History {
  record: (cave: string) => void;
  allow: (cave: string) => boolean;
  clone: () => History;
  list: () => string[];
}