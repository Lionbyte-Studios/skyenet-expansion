import { Bullet } from "../../../core/src/entity/Bullet";
import type { ClientGame } from "../ClientGame";
import type { RenderableEntity } from "./RenderableEntity";

export class ClientBullet extends Bullet implements RenderableEntity {
  public render(ctx: CanvasRenderingContext2D, game: ClientGame) {
    ctx.translate(this.x, this.y);
    ctx.fillStyle = `#ffffaa`;
    ctx.fillRect(-5, -5, 10, 10);
    ctx.translate(-this.x, -this.y);
  }
}
