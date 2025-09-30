import type { MouseInfo, RenderInfo } from "../../ClientManager";
import type { Component } from "../component/Component";

export abstract class ClientScreen {
  protected renderInfo: RenderInfo;
  public components: Component<unknown>[] = [];
  constructor(renderInfo: RenderInfo) {
    this.renderInfo = renderInfo;
  }
  public abstract render(renderInfo: RenderInfo): void;
  public abstract onMouseMove(info: MouseInfo): void;
  public abstract onClick(info: MouseInfo): void;
}
