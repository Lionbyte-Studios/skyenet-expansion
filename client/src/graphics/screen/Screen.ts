import type { MouseInfo, RenderInfo } from "../../ClientManager";
import type { Component, ComponentRenderArgs } from "../component/Component";

export abstract class ClientScreen {
  protected renderInfo: RenderInfo;
  public components: Component<unknown>[] = [];
  constructor(renderInfo: RenderInfo) {
    this.renderInfo = renderInfo;
  }
  public abstract render(renderInfo: RenderInfo): void;
  public onMouseMove(info: MouseInfo): void {}
  public onClick(info: MouseInfo): void {}
  // This method guarantees "clientManager" to be defined.
  public init(): void {}
  protected setComponentData<T extends Component<T["args"]["data"]>>(
    componentPredicate: (component: T, index: number) => boolean,
    data: Partial<ComponentRenderArgs<Partial<T["args"]["data"]>>>,
  ) {
    for (const [i, value] of (this.components as T[]).entries()) {
      if (componentPredicate(value, i)) {
        for (const key in data) {
          this.components[i].args[key] = data[key];
        }
        return;
      }
    }
  }
  protected getComponentByID<C extends Component<unknown>>(
    id: string,
  ): C | undefined {
    return this.components.find((c) => c.args.custom_id === id) as
      | C
      | undefined;
  }
  protected getComponentIndexById(id: string): number | undefined {
    const index = this.components.findIndex((c) => c.args.custom_id === id);
    if (index === -1) return undefined;
    return index;
  }
}
