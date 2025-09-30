import type { MouseInfo, RenderInfo } from "../../ClientManager";

export interface ComponentRenderArgs<T = void> {
  x: number;
  y: number;
  data: T;
}

export abstract class Component<T> {
  public args: ComponentRenderArgs<T>;
  constructor(args: ComponentRenderArgs<T>) {
    this.args = args;
  }
  public abstract render(renderInfo: RenderInfo): void;
  public abstract onMouseMove(info: MouseInfo): void;
  public abstract onClick(info: MouseInfo): void;
}
