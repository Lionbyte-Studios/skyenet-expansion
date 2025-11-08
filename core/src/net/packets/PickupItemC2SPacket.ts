import { EntityID } from "../../types";
import { ServerPlayListener } from "../listener/ServerPlayListener";
import { Packet, PacketID } from "../Packet";
import { PacketBuffer } from "../PacketBuffer";

export class PickupItemsC2SPacket extends Packet<ServerPlayListener> {
  public static override get id(): PacketID {
    return PacketID.PickupItemC2S;
  }

  constructor(public items: EntityID[]) {
    super();
  }

  write(buf: PacketBuffer): void {
    buf.writeArray(this.items, (buf, item) => {
      buf.writeString(item);
    });
  }

  apply(listener: ServerPlayListener): void {
    listener.onPickupItem(this);
  }

  public static override read(buf: PacketBuffer): PickupItemsC2SPacket {
    const items = buf.readArray<EntityID>((buf) => {
      return buf.readString();
    });
    return new PickupItemsC2SPacket(items);
  }
}
