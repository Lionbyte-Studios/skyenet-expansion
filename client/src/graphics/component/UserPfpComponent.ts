import type { MouseInfo, RenderInfo } from "../../ClientManager";
import { Component } from "./Component";
import { fetchBlob } from "../../lib/Util";
import { TextBoxComponent } from "./TextboxComponent";
import { clientManager } from "../../Main";

type HoverActions =
  | { action: "tooltip"; text: string; tooltipWidth?: number }
  | { action: "custom"; fn: () => void };
type BaseUserPfpComponentData = {
  width: number;
  height: number;
  onHover?: HoverActions;
  onClick?: () => void;
};
type UserPfpComponentData =
  | ({ avatar: string; user_id: string } & BaseUserPfpComponentData)
  | ({ url: string } & BaseUserPfpComponentData);

export class UserPfpComponent extends Component<UserPfpComponentData> {
  public image: ImageBitmap | undefined = undefined;
  private distanceSquared: number | undefined = undefined;
  private center: [number, number] | undefined = undefined;
  private renderTooltip: boolean = false;
  public tooltipTextBox: TextBoxComponent = new TextBoxComponent({
    x: this.args.x - this.args.data.width / 2,
    y: this.args.y + this.args.data.width + 10,
    data: {
      text: "Not logged in",
      width: this.args.data.width * 2,
    },
  });
  public render(renderInfo: RenderInfo): void {
    const centerX = this.args.x + this.args.data.width / 2;
    const centerY = this.args.y + this.args.data.height / 2;
    const radius = Math.min(this.args.data.width, this.args.data.height) / 2;

    if (this.image !== undefined) {
      renderInfo.ctx.save();
      renderInfo.ctx.beginPath();
      renderInfo.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
      renderInfo.ctx.closePath();
      renderInfo.ctx.clip();
      renderInfo.ctx.drawImage(
        this.image,
        this.args.x,
        this.args.y,
        this.args.data.width,
        this.args.data.height,
      );
    }
    renderInfo.ctx.restore();
    // draw border
    renderInfo.ctx.beginPath();
    renderInfo.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    renderInfo.ctx.lineWidth = 4;
    renderInfo.ctx.strokeStyle = "#ffffff";
    renderInfo.ctx.stroke();

    // draw tooltip
    if (this.renderTooltip) {
      if (this.args.data.onHover?.action !== "tooltip") return;
      this.tooltipTextBox.render(renderInfo);
    }
  }
  public override init(): void {
    this.distanceSquared = Math.pow(this.args.data.width / 2, 2);
    this.center = [
      this.args.x + this.args.data.width / 2,
      this.args.y + this.args.data.width / 2,
    ];
    (async () => {
      const url =
        "url" in this.args.data
          ? this.args.data.url
          : `https://cdn.discordapp.com/avatars/${this.args.data.user_id}/${this.args.data.avatar}`;
      const imageBlob = await fetchBlob(url);
      this.image = await createImageBitmap(imageBlob);
      console.log("Loaded user pfp");
    })();
  }
  public override onMouseMove(info: MouseInfo): void {
    this.renderTooltip = false;
    if (this.args.data.onHover === undefined) return;
    const { x, y } = info.base;
    if (this.distanceSquared === undefined || this.center === undefined) return;
    const dist = Math.abs(
      Math.pow(Math.abs(this.center[0] - x), 2) +
        Math.pow(Math.abs(this.center[1] - y), 2),
    );
    if (dist > this.distanceSquared) return;
    if (this.args.data.onHover.action === "tooltip") {
      this.renderTooltip = true;
      clientManager.cursor = "pointer";
    } else {
      this.args.data.onHover.fn();
    }
  }
}
