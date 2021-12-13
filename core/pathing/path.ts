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

    const availableCaves = this.segments
      .connectedTo(cave)
      .filter(it => it != 'start')
      .filter(this.history.allow);
    
    return availableCaves.map((cave) => this.clone().follow(cave)).flat();
  }

  private clone = () =>
    new Path(
      this.segments, 
      this.opts,
      this.history.clone(), // [!] Cloning very important!
    ); 

  private progressReport = () => this.history.list().join(',');
}