import { History, BasicHistory as BasicHistory, Mode } from "./history";
import { Segments } from "./segments";

export type Options = {
  debug?: boolean;
  loose?: boolean;
}

export default class Path {
  private readonly segments: Segments;
  private history: History;
  private opts: Options;

  constructor(segments: Segments, opts: Options = { debug: false, loose: false }, history: History | null = null) {
    this.segments = segments;
    const defaultOptions: Options = { debug: false, loose: false };
    this.opts = {...defaultOptions, ...opts};
    this.history = history || new BasicHistory(opts.loose ? Mode.Loose : Mode.Default);
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

  private clone = () =>
    new Path(
      this.segments, 
      this.opts,
      this.history.clone(), // [!] Cloning very important!
    ); 

  private progressReport = () => this.history.list().join(',');
}