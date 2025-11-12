import { Entity, EntityType } from "../../entity/Entity";
import { EntityRegistry } from "../../entity/EntityRegistry";
import { EntityID, GameID, PlayerID } from "../../types";
import { ClientPlayListener } from "../listener/ClientPlayListener";
import { Packet, PacketID } from "../Packet";
import { PacketBuffer } from "../PacketBuffer";

export class JoinCallbackS2CPacket extends Packet<ClientPlayListener> {
  static override get id(): PacketID {
    return PacketID.JoinCallbackS2C;
  }

  constructor(
    public playerID: PlayerID,
    public entityID: EntityID,
    public gameID: GameID,
    // public players: Player[],
    public entities: Entity[],
    public world_id: string,
  ) {
    super();
  }
  write(buf: PacketBuffer): void {
    buf.writeString(this.playerID);
    buf.writeString(this.entityID);
    buf.writeString(this.gameID);
    // buf.writeArray(this.players, (b, item) => {
    //   item.netWrite(b);
    // });
    buf.writeArray(this.entities, (b, item) => {
      b.writeInt(
        (item.constructor as unknown as { entityType: EntityType }).entityType,
      );
      item.netWrite(b);
    });
    buf.writeString(this.world_id);
  }
  apply(listener: ClientPlayListener): void {
    listener.onJoinCallback(this);
  }
  static override read(buf: PacketBuffer): JoinCallbackS2CPacket {
    const playerID = buf.readString();
    const entityID = buf.readString();
    const gameID = buf.readString();
    // const players: Player[] = buf.readArray((buf) => {
    //   return Player.playerClass.netRead(buf);
    // });
    const entities: Entity[] = buf.readArray<Entity>((buf) => {
      return EntityRegistry.create(buf.readInt(), buf);
    });
    const world_id = buf.readString();

    return new JoinCallbackS2CPacket(
      playerID,
      entityID,
      gameID,
      // players,
      entities,
      world_id,
    );
  }
}
