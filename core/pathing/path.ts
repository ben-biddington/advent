import { DefaultHistory, History, LooseHistory } from "./history";
import { Segments } from "./segments";

export default class Path {
  private readonly segments: Segments;
  private history: History;
  private _debug: boolean = false;

  constructor(segments: Segments, history: History | null = null) {
    this.segments = segments;
    this.history = history || new DefaultHistory();
  }

  debug() {
    this._debug = true;
  }

  loose() {
    this.history = new LooseHistory();
  }

  follow(start: string) : string[] {
    this.history.record(start);

    if (start === 'end') {
      return [this.progressReport()];
    }

    // [!] Can go backwards or forwards
    const allDestinations = [
      ...this.segments.startingAt(start).map(it => it.end), 
      ...this.segments.endingAt(start).map(it => it.start)
    ].filter(it => it != 'start');

    const nextAvailableCaves = allDestinations.filter(this.history.allow);
    
    return nextAvailableCaves
      .map((cave) => {
        const path = new Path(
          this.segments, 
          this.history.clone(), // [!] Copying progress very important!
        ); 
        
        if (this._debug) {
          path.debug();
        }

        return path.follow(cave);
      }).flat();
  }

  private progressReport() {
    return this.history.list().join(',');
  }
}