import type { MouseInfo, RenderInfo } from "../../ClientManager";

export interface ComponentRenderArgs<T = void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  x: number;
  y: number;
  data: T;
  custom_id?: string;
}

export abstract class Component<T> {
  public args: ComponentRenderArgs<T>;
  constructor(args: ComponentRenderArgs<T>) {
    this.args = args;
  }
  public abstract render(renderInfo: RenderInfo): void;
  public abstract onMouseMove(info: MouseInfo): void;
  public abstract onClick(info: MouseInfo): void;
  public onKeyDown(event: KeyboardEvent): void {}
}
