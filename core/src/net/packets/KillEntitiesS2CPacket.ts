import { EntityID } from "../../types";
import { ClientPlayListener } from "../listener/ClientPlayListener";
import { Packet, PacketID } from "../Packet";
import { PacketBuffer } from "../PacketBuffer";

export class KillEntitiesS2CPacket extends Packet<ClientPlayListener> {
  public static override get id(): PacketID {
    return PacketID.KillEntitiesS2C;
  }

  constructor(public entityIDs: EntityID[]) {
    super();
  }

  write(buf: PacketBuffer): void {
    buf.writeArray(this.entityIDs, (b, item) => {
      b.writeString(item);
    });
  }
  apply(listener: ClientPlayListener): void {
    listener.onKillEntities(this);
  }

  public static override read(buf: PacketBuffer): KillEntitiesS2CPacket {
    const entities: string[] = buf.readArray<string>((buf) => {
      return buf.readString();
    });
    return new KillEntitiesS2CPacket(entities);
  }
}
