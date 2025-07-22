export abstract class CanvasElement {
  protected x: number;
  protected y: number;
  protected width?: number;
  protected height?: number;
  protected ctx: CanvasRenderingContext2D;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width?: number,
    height?: number,
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    if (width !== undefined) this.width = width;
    if (height !== undefined) this.height = height;
  }

  public abstract render(): void;
}
