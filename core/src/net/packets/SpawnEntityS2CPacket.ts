import { Entity, EntityType } from "../../entity/Entity";
import { EntityRegistry } from "../../entity/EntityRegistry";
import { ClientPlayListener } from "../listener/ClientPlayListener";
import { Packet, PacketID } from "../Packet";
import { PacketBuffer } from "../PacketBuffer";

export class SpawnEntityS2CPacket extends Packet<ClientPlayListener> {
  public static override get id(): PacketID {
    return PacketID.SpawnEntityS2C;
  }

  constructor(public entity: Entity) {
    super();
  }

  write(buf: PacketBuffer): void {
    console.log("Sending spawn entity packet with entity:");
    console.log(this.entity);
    buf.writeInt(
      (this.entity.constructor as unknown as { entityType: EntityType })
        .entityType,
    );
    this.entity.netWrite(buf);
  }
  apply(listener: ClientPlayListener): void {
    listener.onSpawnEntity(this);
  }
  public static override read(buf: PacketBuffer): SpawnEntityS2CPacket {
    return new SpawnEntityS2CPacket(EntityRegistry.create(buf.readInt(), buf));
  }
}
