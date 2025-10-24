import { BulletType } from "../../entity/Bullet";
import { PlayerID } from "../../types";
import { ServerPlayListener } from "../listener/ServerPlayListener";
import { Packet, PacketID } from "../Packet";
import { PacketBuffer } from "../PacketBuffer";

export class BulletShootC2SPacket extends Packet<ServerPlayListener> {
  public static override get id(): PacketID {
    return PacketID.BulletShootC2S;
  }
  constructor(
    public owner: PlayerID,
    public bulletType: BulletType,
    public x: number,
    public y: number,
    public velX: number,
    public velY: number,
  ) {
    super();
  }

  write(buf: PacketBuffer): void {
    buf.writeString(this.owner);
    buf.writeInt(this.bulletType);
    buf.writeFloat(this.x);
    buf.writeFloat(this.y);
    buf.writeFloat(this.velX);
    buf.writeFloat(this.velY);
  }
  apply(listener: ServerPlayListener): void {
    listener.onBulletShoot(this);
  }
  static override read(buf: PacketBuffer): BulletShootC2SPacket {
    return new BulletShootC2SPacket(
      buf.readString(),
      buf.readInt(),
      buf.readFloat(),
      buf.readFloat(),
      buf.readFloat(),
      buf.readFloat(),
    );
  }
}
