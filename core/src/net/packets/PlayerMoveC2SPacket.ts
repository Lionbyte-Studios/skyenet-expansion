import { ServerPlayListener } from "../listener/ServerPlayListener";
import { Packet, PacketDirection, PacketID } from "../Packet";
import { PacketBuffer } from "../PacketBuffer";

export class PlayerMoveC2SPacket extends Packet<ServerPlayListener> {
  static override get id() {
    return PacketID.PlayerMoveC2SPacket;
  }
  static override direction = PacketDirection.C2S;

  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }

  override write(buf: PacketBuffer): void {
    buf.writeFloat(this.x);
    buf.writeFloat(this.y);
  }

  static override read(buf: PacketBuffer): PlayerMoveC2SPacket {
    return new PlayerMoveC2SPacket(buf.readFloat(), buf.readFloat());
  }

  override apply(listener: ServerPlayListener): void {
    listener.onPlayerMove(this);
  }
}
