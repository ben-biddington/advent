export type Log = {
  info: (m: string) => void;
  debug: (m: string) => void;
  trace: (m: string) => void;
};

export class InMemoryLog implements Log {
  messages: string[] = [];

  info  = (m: string) => this.messages.push(m);
  debug = (m: string) => this.messages.push(`[debug] ${m}`);
  trace = (m: string) => this.messages.push(`[trace] ${m}`);
}