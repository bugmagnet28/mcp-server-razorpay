import { createInterface } from 'readline';

export type HandlerFn = (args: any) => Promise<any> | any;

export class StdioTransport {
  private handlers: Record<string, HandlerFn> = {};

  register(name: string, fn: HandlerFn) {
    this.handlers[name] = fn;
  }

  start() {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: false });
    rl.on('line', async (line) => {
      line = line.trim();
      if (!line) return;
      try {
        const req = JSON.parse(line);
        const { id, method, params } = req;
        const handler = this.handlers[method];
        if (!handler) {
          const res = { id, error: `Unknown method: ${method}` };
          console.log(JSON.stringify(res));
          return;
        }
        const result = await handler(params);
        console.log(JSON.stringify({ id, result }));
      } catch (err: any) {
        // Always respond with something so caller isn't left waiting
        try {
          const parsed = JSON.parse(line);
          const id = parsed?.id;
          console.log(JSON.stringify({ id, error: String(err?.message || err) }));
        } catch {
          console.log(JSON.stringify({ id: null, error: String(err?.message || err) }));
        }
      }
    });
  }
}
