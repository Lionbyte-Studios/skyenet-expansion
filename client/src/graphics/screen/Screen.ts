import type { RenderInfo } from "../../ClientManager";

export abstract class ClientScreen {
  protected renderInfo: RenderInfo;
  constructor(renderInfo: RenderInfo) {
    this.renderInfo = renderInfo;
  }
  public abstract render(renderInfo: RenderInfo): void;
  public abstract onMouseMove(
    event: MouseEvent,
    canvasXY: [number, number],
  ): void;
  public abstract onClick(
    event: PointerEvent,
    canvasXY: [number, number],
  ): void;
}
