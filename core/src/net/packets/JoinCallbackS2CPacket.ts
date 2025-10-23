import { Entity } from "../../entity/Entity";
import { EntityRegistry } from "../../entity/EntityRegistry";
import { Player } from "../../entity/Player";
import {
  EntityID,
  GameID,
  PlayerID,
} from "../../types";
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
    public players: Player[],
    public entities: Entity[],
  ) {
    super();
  }
  write(buf: PacketBuffer): void {
    buf.writeString(this.playerID);
    buf.writeString(this.entityID);
    buf.writeString(this.gameID);
    buf.writeArray(this.players, (b, item) => {
      item.netWrite(b);
    });
    buf.writeArray(this.entities, (b, item) => {
      item.netWrite(b);
    });
  }
  apply(listener: ClientPlayListener): void {
    listener.onJoinCallback(this);
  }
  static override read(buf: PacketBuffer): JoinCallbackS2CPacket {
    const playerID = buf.readString();
    const entityID = buf.readString();
    const gameID = buf.readString();
    const players: Player[] = buf.readArray<Player>((buf) => {
      return Player.netRead(buf);
    });
    const entities: Entity[] = buf.readArray<Entity>((buf) => {
      return EntityRegistry.create(buf.readInt(), buf);
    });

    return new JoinCallbackS2CPacket(
      playerID,
      entityID,
      gameID,
      players,
      entities,
    );
  }
}
