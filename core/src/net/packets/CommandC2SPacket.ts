import { ServerPlayListener } from "../listener/ServerPlayListener";
import { Packet, PacketID } from "../Packet";
import { PacketBuffer } from "../PacketBuffer";

export class CommandC2SPacket extends Packet<ServerPlayListener> {
  public static override get id(): PacketID {
    return PacketID.CommandC2S;
  }

  constructor(public command: string) {
    super();
  }

  write(buf: PacketBuffer): void {
    buf.writeString(this.command);
  }
  apply(listener: ServerPlayListener): void {
    listener.onCommand(this);
  }
  public static override read(buf: PacketBuffer): CommandC2SPacket {
    return new CommandC2SPacket(buf.readString());
  }
}
