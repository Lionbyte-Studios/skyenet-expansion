import type { MouseInfo, RenderInfo } from "../../ClientManager";
import { isInArea } from "../../lib/Util";
import { Component } from "./Component";

export class ButtonComponent extends Component<
  | {
      width: number;
      height: number;
      text: string;
      onclick: () => void;
      hidden?: false;
    }
  | { width: number; height: number; onclick: () => void; hidden: true }
> {
  private hovered: boolean = false;
  public render(renderInfo: RenderInfo): void {
    // dont render anything if hidden is true
    if ("hidden" in this.args.data && this.args.data.hidden === true) return;
    renderInfo.ctx.save();
    renderInfo.ctx.scale(1, 1);
    renderInfo.ctx.translate(0, 0);
    if (this.hovered) {
      renderInfo.ctx.fillStyle = "#535353";
    } else {
      renderInfo.ctx.fillStyle = "#333333";
    }
    renderInfo.ctx.fillRect(
      this.args.x,
      this.args.y,
      this.args.data.width,
      this.args.data.height,
    );
    renderInfo.ctx.fillStyle = "#ffffff";
    renderInfo.ctx.font = "24px Arial";
    renderInfo.ctx.textAlign = "center";
    renderInfo.ctx.textBaseline = "middle";
    renderInfo.ctx.fillText(
      this.args.data.text,
      this.args.x + this.args.data.width * 0.5,
      this.args.y + this.args.data.height * 0.5,
      this.args.data.width,
    );
    renderInfo.ctx.restore();
  }
  public onMouseMove(info: MouseInfo): void {
    this.hovered = isInArea(
      {
        x: this.args.x,
        y: this.args.y,
        width: this.args.data.width,
        height: this.args.data.height,
      },
      { x: info.base.x, y: info.base.y },
    );
  }
  public onClick(info: MouseInfo): void {
    if (
      !isInArea(
        {
          x: this.args.x,
          y: this.args.y,
          width: this.args.data.width,
          height: this.args.data.height,
        },
        { x: info.base.x, y: info.base.y },
      )
    )
      return;
    this.args.data.onclick();
  }
}
