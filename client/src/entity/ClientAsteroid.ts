import { Asteroid } from "../../../core/src/entity/Asteroid";
import type { RenderInfo } from "../ClientManager";
import type { RenderableEntity } from "./RenderableEntity";

export class ClientAsteroid extends Asteroid implements RenderableEntity {
  public render(info: RenderInfo) {
    if (info.game === undefined) return;
    info.ctx.translate(info.game.camera.x, info.game.camera.y);
    info.ctx.translate(
      this.x - info.game.camera.x,
      this.y - info.game.camera.y,
    );
    info.ctx.rotate((this.rotation * Math.PI) / 180);
    info.ctx.translate(
      -(this.x - info.game.camera.x),
      -(this.y - info.game.camera.y),
    );
    info.atlasManager.drawTextureCentered(
      "entities",
      "asteroid",
      info.ctx,
      this.x - info.game.camera.x,
      this.y - info.game.camera.y,
      this.size * 16,
      this.size * 16,
    );
    info.ctx.translate(
      this.x - info.game.camera.x,
      this.y - info.game.camera.y,
    );
    info.ctx.rotate(-((this.rotation * Math.PI) / 180));
    info.ctx.translate(
      -(this.x - info.game.camera.x),
      -(this.y - info.game.camera.y),
    );
    info.ctx.translate(-info.game.camera.x, -info.game.camera.y);
  }
}
