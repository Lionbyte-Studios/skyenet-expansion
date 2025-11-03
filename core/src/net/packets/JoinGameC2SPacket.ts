import { ShipEngineSprite, ShipSprite } from "../../types";
import { toStringEnum } from "../../util/Util";
import { ServerPlayListener } from "../listener/ServerPlayListener";
import { Packet, PacketID } from "../Packet";
import { PacketBuffer } from "../PacketBuffer";

export class JoinGameC2SPacket extends Packet<ServerPlayListener> {
  static override get id() {
    return PacketID.JoinGameC2S;
  }
  constructor(
    public selectedShip: ShipSprite,
    public selectedShipEngine: ShipEngineSprite,
    public token?: string,
  ) {
    super();
  }
  write(buf: PacketBuffer): void {
    buf.writeString(this.selectedShip);
    buf.writeString(this.selectedShipEngine);
    buf.writeString(this.token === undefined ? "" : this.token);
  }
  apply(listener: ServerPlayListener): void {
    listener.onJoinGame(this);
  }
  static override read(buf: PacketBuffer): JoinGameC2SPacket {
    const shipSprite: ShipSprite | undefined = toStringEnum(
      ShipSprite,
      buf.readString(),
    );
    const shipEngineSprite: ShipEngineSprite | undefined = toStringEnum(
      ShipEngineSprite,
      buf.readString(),
    );
    const token = buf.readString();
    if (shipSprite === undefined) throw new Error("shipSprite is invalid.");
    if (shipEngineSprite === undefined)
      throw new Error("shipEngineSprite is invalid.");
    return new JoinGameC2SPacket(
      shipSprite,
      shipEngineSprite,
      token.length === 0 ? undefined : token,
    );
  }
}
