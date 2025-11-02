import { Asteroid } from "../../../core/src/entity/Asteroid";
import type { PacketBuffer } from "../../../core/src/net/PacketBuffer";
import type { EntityID } from "../../../core/src/types";
import type { RenderInfo } from "../ClientManager";
import type { RenderableEntity } from "./RenderableEntity";

export class ClientAsteroid extends Asteroid implements RenderableEntity {
  private spawnAnimationState: number;
  constructor(
    x: number,
    y: number,
    rotation: number,
    size: number,
    entityID?: EntityID,
  ) {
    super(x, y, rotation, size, entityID);
    this.spawnAnimationState = 0;
  }
  public render(info: RenderInfo) {
    if (info.game === undefined) return;
    if (this.spawnAnimationState < 100) this.spawnAnimationState += 2;
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
      this.size * 16 * (this.spawnAnimationState / 100),
      this.size * 16 * (this.spawnAnimationState / 100),
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

  public onKill(info: RenderInfo) {
    /* TODO particles */
  }
  public static override netRead(buf: PacketBuffer): Asteroid {
    return new ClientAsteroid(
      buf.readFloat(),
      buf.readFloat(),
      buf.readFloat(),
      buf.readInt(),
      buf.readString(),
    );
  }
}
