import { Bullet } from "../../../core/src/entity/Bullet";
import type { RenderableEntity, RenderInfo } from "./RenderableEntity";

export class ClientBullet extends Bullet implements RenderableEntity {
  public render(info: RenderInfo) {
    info.ctx.translate(this.x, this.y);
    info.ctx.fillStyle = `#ffffaa`;
    info.ctx.fillRect(-5, -5, 10, 10);
    info.ctx.translate(-this.x, -this.y);
  }
}
