import { ClientPlayListener } from "../listener/ClientPlayListener";
import { Packet, PacketID } from "../Packet";
import { PacketBuffer } from "../PacketBuffer";

export class ChatMessageS2CPacket extends Packet<ClientPlayListener> {
  public static override get id(): PacketID {
    return PacketID.ChatMessageS2C;
  }
  constructor(public message: string) {
    super();
  }
  write(buf: PacketBuffer): void {
    buf.writeString(this.message);
  }
  apply(listener: ClientPlayListener): void {
    listener.onChatMessage(this);
  }
  public static override read(buf: PacketBuffer): ChatMessageS2CPacket {
    return new ChatMessageS2CPacket(buf.readString());
  }
}
