import { ClientPlayListener } from "../listener/ClientPlayListener";
import { Packet, PacketID } from "../Packet";
import { PacketBuffer } from "../PacketBuffer";

export class DebugS2CPacket extends Packet<ClientPlayListener> {
  static override get id() {
    return PacketID.DebugS2C;
  }
  private message: string;
  constructor(message: string) {
    super();
    this.message = message;
  }
  write(buf: PacketBuffer): void {
    buf.writeString(this.message);
  }
  apply(listener: ClientPlayListener): void {
    listener.onDebug(this);
  }
  static override read(buf: PacketBuffer): DebugS2CPacket {
    return new DebugS2CPacket(buf.readString());
  }
  public getMessage(): string {
    return this.message;
  }
}
