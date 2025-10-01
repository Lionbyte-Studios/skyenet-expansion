import type { MouseInfo, RenderInfo } from "../../ClientManager";
import type { Component, ComponentRenderArgs } from "../component/Component";

export abstract class ClientScreen {
  protected renderInfo: RenderInfo;
  public components: Component<unknown>[] = [];
  constructor(renderInfo: RenderInfo) {
    this.renderInfo = renderInfo;
  }
  public abstract render(renderInfo: RenderInfo): void;
  public abstract onMouseMove(info: MouseInfo): void;
  public abstract onClick(info: MouseInfo): void;
  // This method guarantees "clientManager" to be defined.
  public init(): void {}
  protected setComponentData<D = void>(
    componentPredicate: (component: Component<D>, index: number) => boolean,
    data: Partial<ComponentRenderArgs<D>>,
  ) {
    for (const [i, value] of (this.components as Component<D>[]).entries()) {
      if (componentPredicate(value, i)) {
        for (const key in data) {
          this.components[i].args[key] = data[key];
        }
        return;
      }
    }
  }
}
