export type Segment = { start: string; end: string; }

export class Segments {
  private readonly paths: Segment[] = [];

  get count() {
    return this.paths.length;
  }

  startingAt(startNode: string): Segment[] {
    return this.paths.filter(it => it.start === startNode);
  }

  endingAt(startNode: string): Segment[] {
    return this.paths.filter(it => it.end === startNode);
  }

  constructor(paths: Segment[]) {
    this.paths.push(...paths);
  }
}
