import { Bullet } from "../../../core/src/entity/Bullet";
import type { PacketBuffer } from "../../../core/src/net/PacketBuffer";
import type { RenderInfo } from "../ClientManager";
import type { RenderableEntity } from "./RenderableEntity";

export class ClientBullet extends Bullet implements RenderableEntity {
  public render(info: RenderInfo) {
    info.ctx.translate(this.x, this.y);
    info.ctx.fillStyle = `#ffffaa`;
    info.ctx.fillRect(-5, -5, 10, 10);
    info.ctx.translate(-this.x, -this.y);
  }
  public static override netRead(buf: PacketBuffer): Bullet {
    return new ClientBullet(
      buf.readFloat(),
      buf.readFloat(),
      buf.readFloat(),
      buf.readFloat(),
      buf.readString(),
      buf.readString(),
    );
  }
}
