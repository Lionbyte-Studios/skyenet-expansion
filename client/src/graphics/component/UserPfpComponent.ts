import type { RenderInfo } from "../../ClientManager";
import { Component } from "./Component";
import { fetchBlob } from "../../lib/Util";

export class UserPfpComponent extends Component<
  | { avatar: string; user_id: string; width: number; height: number }
  | { url: string; width: number; height: number }
> {
  public image: ImageBitmap | undefined = undefined;
  public render(renderInfo: RenderInfo): void {
    const centerX = this.args.x + this.args.data.width / 2;
    const centerY = this.args.y + this.args.data.height / 2;
    const radius = Math.min(this.args.data.width, this.args.data.height) / 2;

    if (this.image !== undefined) {
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
    // draw border
    renderInfo.ctx.beginPath();
    renderInfo.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    renderInfo.ctx.lineWidth = 4;
    renderInfo.ctx.strokeStyle = "#ffffff";
    renderInfo.ctx.stroke();
  }
  public override init(): void {
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
}
