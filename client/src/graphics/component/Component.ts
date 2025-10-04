import type { MouseInfo, RenderInfo } from "../../ClientManager";

export interface ComponentRenderArgs<T = void> {
  [key: string]: unknown;
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
  public onKeyDown(event: KeyboardEvent): void {}
  public onMouseMove(info: MouseInfo): void {}
  public onClick(info: MouseInfo): void {}
  public init(): void {}
}
