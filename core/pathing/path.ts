import { History, BasicHistory as BasicHistory, Mode } from "./history";
import { Segments } from "./segments";

export default class Path {
  private readonly segments: Segments;
  private history: History;
  private _debug: boolean = false;

  constructor(segments: Segments, history: History | null = null) {
    this.segments = segments;
    this.history = history || new BasicHistory(Mode.Default);
  }

  debug() {
    this._debug = true;
  }

  loose() {
    this.history = new BasicHistory(Mode.Loose);
  }

  follow(cave: string) : string[] {
    this.history.record(cave);

    if (cave === 'end')
      return [this.progressReport()];

    // [!] Can go backwards or forwards
    const allDestinations = [
      ...this.segments.startingAt(cave).map(it => it.end), 
      ...this.segments.endingAt(cave).map(it => it.start)
    ].filter(it => it != 'start');

    const allAllowedDestinationCaves = allDestinations.filter(this.history.allow);
    
    return allAllowedDestinationCaves.map((cave) => this.clone().follow(cave)).flat();
  }

  private clone() {
    const path = new Path(
      this.segments, 
      this.history.clone(), // [!] Cloning very important!
    ); 
    
    if (this._debug) {
      path.debug();
    }

    return path;
  }

  private progressReport() {
    return this.history.list().join(',');
  }
}