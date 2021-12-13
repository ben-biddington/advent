export type Segment = { start: string; end: string; }

export class Segments {
  private readonly paths: Segment[] = [];

  get count() {
    return this.paths.length;
  }

  connectedTo(startNode: string) {
    return [
      ...this.endPoints(startNode), 
      ...this.startPoints(startNode)
    ]
  }

  endPoints(startNode: string) {
    return this.startingAt(startNode).map(it => it.end);
  }

  startPoints(startNode: string) {
    return this.endingAt(startNode).map(it => it.start);
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
