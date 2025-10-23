import { ServerPlayListener } from "../listener/ServerPlayListener";
import { Packet, PacketID } from "../Packet";
import { PacketBuffer } from "../PacketBuffer";

export class JoinGameC2SPacket extends Packet<ServerPlayListener> {
  static override get id() {
    return PacketID.JoinGameC2SPacket;
  }
  public randomInt: number;
  constructor(randomInt: number) {
    super();
    this.randomInt = randomInt;
  }
  write(buf: PacketBuffer): void {
    buf.writeInt(this.randomInt);
  }
  apply(listener: ServerPlayListener): void {
    listener.onJoinGame(this);
  }
  static override read(buf: PacketBuffer): JoinGameC2SPacket {
    return new JoinGameC2SPacket(buf.readInt());
  }
}
