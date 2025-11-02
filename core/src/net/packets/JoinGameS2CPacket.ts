import { EntityID, PlayerID, ShipEngineSprite, ShipSprite } from "../../types";
import { toStringEnum } from "../../util/Util";
import { ClientPlayListener } from "../listener/ClientPlayListener";
import { Packet, PacketID } from "../Packet";
import { PacketBuffer } from "../PacketBuffer";

export class JoinGameS2CPacket extends Packet<ClientPlayListener> {
  static override get id() {
    return PacketID.JoinGameS2C;
  }
  constructor(
    public playerID: PlayerID,
    public entityID: EntityID,
    public x: number,
    public y: number,
    public rotation: number,
    public selectedShip: ShipSprite,
    public selectedShipEngine: ShipEngineSprite,
  ) {
    super();
  }
  write(buf: PacketBuffer): void {
    buf.writeString(this.playerID);
    buf.writeString(this.entityID);
    buf.writeFloat(this.x);
    buf.writeFloat(this.y);
    buf.writeFloat(this.rotation);
    buf.writeString(this.selectedShip);
    buf.writeString(this.selectedShipEngine);
  }
  apply(listener: ClientPlayListener): void {
    listener.onPlayerJoin(this);
  }
  static override read(buf: PacketBuffer): JoinGameS2CPacket {
    return new JoinGameS2CPacket(
      buf.readString(),
      buf.readString(),
      buf.readFloat(),
      buf.readFloat(),
      buf.readFloat(),
      (() => {
        const sprite = toStringEnum(ShipSprite, buf.readString());
        if (sprite === undefined) throw new Error("Invalid ShipSprite");
        return sprite;
      })(),
      (() => {
        const sprite = toStringEnum(ShipEngineSprite, buf.readString());
        if (sprite === undefined) throw new Error("Invalid ShipEngineSprite");
        return sprite;
      })(),
    );
  }
}
