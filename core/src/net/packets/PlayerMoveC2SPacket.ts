import { ServerPlayListener } from "../listener/ServerPlayListener";
import { Packet, PacketDirection, PacketID } from "../Packet";
import { PacketBuffer } from "../PacketBuffer";

export class PlayerMoveC2SPacket extends Packet<ServerPlayListener> {
  static override get id() {
    return PacketID.PlayerMoveC2S;
  }
  static override direction = PacketDirection.C2S;

  constructor(
    public x: number,
    public y: number,
    public rotation: number,
    public velX: number,
    public velY: number,
    public velR: number,
    public engineActive: boolean,
  ) {
    super();
  }

  override write(buf: PacketBuffer): void {
    buf.writeFloat(this.x);
    buf.writeFloat(this.y);
    buf.writeFloat(this.rotation);
    buf.writeFloat(this.velX);
    buf.writeFloat(this.velY);
    buf.writeFloat(this.velR);
    buf.writeBoolean(this.engineActive);
  }

  static override read(buf: PacketBuffer): PlayerMoveC2SPacket {
    return new PlayerMoveC2SPacket(
      buf.readFloat(),
      buf.readFloat(),
      buf.readFloat(),
      buf.readFloat(),
      buf.readFloat(),
      buf.readFloat(),
      buf.readBoolean(),
    );
  }

  override apply(listener: ServerPlayListener): void {
    listener.onPlayerMove(this);
  }
}
