import { isLowerCase } from "../text";
import { Segments } from "./segments";

export default class Path {
  private readonly segments: Segments;
  private progress: string[] = [];
  private smallCaves: string[] = [];
  private log: (m: any) => void = (m) => this._debug ? console.log(m) : () => {};
  private _debug: boolean = false;

  constructor(segments: Segments, progress: string[] = []) {
    this.segments = segments;
    this.progress = progress;
    this.smallCaves = progress.filter(isLowerCase);
  }

  debug() {
    this._debug = true;
  }

  follow(start: string) : string[] {
    this.progress.push(start);

    if (start === 'end') {
      return [this.progressReport()];
    }

    if (isLowerCase(start)) {
      this.smallCaves.push(start);
    }

    // [!] Can go backwards or forwards
    const allDestinations = [
      ...this.segments.startingAt(start).map(it => it.end), 
      ...this.segments.endingAt(start).map(it => it.start).filter(it => it != 'start')
    ];

    const nextAvailableCaves = allDestinations
      .filter(it  => false === this.smallCaves.includes(it));
    
    this.log({ 
      progress: this.progressReport(),
      current: start,
      'reverse-destinations': this.segments.endingAt(start).map(it => it.start).filter(it => it != 'start'),
      nextAvailableCaves
    });
  
    if (nextAvailableCaves.length === 0) {
      return []; // Never made it to 'end'
    }

    return nextAvailableCaves
      .map((cave) => {
        const path = new Path(this.segments, [...this.progress]); // [!] Copying progress very important!
        
        if (this._debug) {
          path.debug();
        }

        return path.follow(cave);
      }).flat();
  }

  private progressReport() {
    return this.progress.join(',');
  }
}