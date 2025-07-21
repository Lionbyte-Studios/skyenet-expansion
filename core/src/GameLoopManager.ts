export class GameLoopManager {
  private readonly tickFunction;
  private readonly tps;
  private readonly timePerTick;
  private nextTickTime;
  private running;

  constructor(tickFunction: () => void, tps: number) {
    this.tickFunction = tickFunction;
    this.tps = tps;
    this.timePerTick = 1000 / tps;
    this.nextTickTime = Date.now();
    this.running = false;
  }
  public start() {
    this.running = true;
    this.nextTickTime = Date.now();
    this.scheduleNextTick();
  }
  public stop() {
    this.running = false;
  }
  private scheduleNextTick() {
    if (!this.running) return;
    const now = Date.now();
    const drift = now - this.nextTickTime;
    this.nextTickTime += this.timePerTick;

    this.tickFunction();

    const delay = Math.max(0, this.timePerTick - drift);
    setTimeout(() => this.scheduleNextTick(), delay);
  }
}
