import { ClientPlayListener } from "../listener/ClientPlayListener";
import { Packet, PacketID } from "../Packet";
import { PacketBuffer } from "../PacketBuffer";

export class ModifyEntitiesS2CPacket extends Packet<ClientPlayListener> {
  public static override get id(): PacketID {
    return PacketID.ModifyEntitiesS2C;
  }

  constructor(
    public entityModifications: { entityID: string; modifications: object }[],
  ) {
    super();
  }

  write(buf: PacketBuffer): void {
    buf.writeArray(this.entityModifications, (b, item) => {
      b.writeString(item.entityID);
      b.writeString(JSON.stringify(item.modifications));
    });
  }
  apply(listener: ClientPlayListener): void {
    listener.onModifyEntities(this);
  }
  public static override read(buf: PacketBuffer): ModifyEntitiesS2CPacket {
    return new ModifyEntitiesS2CPacket(
      buf.readArray((b) => {
        return {
          entityID: b.readString(),
          modifications: JSON.parse(b.readString()),
        };
      }),
    );
  }
}
