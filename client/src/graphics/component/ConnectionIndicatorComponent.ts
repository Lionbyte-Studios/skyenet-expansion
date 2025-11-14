import type { RenderInfo } from "../../ClientManager";
import { clientManager } from "../../Main";
import { Component, type ComponentRenderArgs } from "./Component";

export class ConnectionIndicatorComponent extends Component<{
  circleRadius?: number;
  textFont?: string;
}> {
  constructor(
    args: ComponentRenderArgs<{ circleRadius?: number; textFont?: string }>,
  ) {
    args.data.circleRadius ??= 10;
    args.data.textFont ??= "16px Arial";
    super(args);
  }

  public render(renderInfo: RenderInfo): void {
    let text: string = "";
    let color: string = "";
    const currentWsState = clientManager.webSocketClient.currentConnectionState;
    if (currentWsState === "connecting") {
      text = "connecting...";
      color = "yellow";
    } else if (currentWsState === "connected") {
      text = "connected";
      color = "green";
    } else if (currentWsState === "disconnected") {
      text = "disconnected";
      color = "red";
    }
    renderInfo.ctx.beginPath();
    renderInfo.ctx.arc(
      this.args.x,
      this.args.y,
      this.args.data.circleRadius!,
      0,
      2 * Math.PI,
    );
    renderInfo.ctx.fillStyle = color;
    renderInfo.ctx.fill();
    renderInfo.ctx.textAlign = "left";
    renderInfo.ctx.textBaseline = "middle";
    renderInfo.ctx.font = this.args.data.textFont!;
    renderInfo.ctx.fillStyle = "white";
    renderInfo.ctx.fillText(
      text,
      this.args.x + this.args.data.circleRadius! * 2,
      this.args.y,
    );
  }
}
