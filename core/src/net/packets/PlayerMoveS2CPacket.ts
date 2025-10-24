import { Player } from "../../entity/Player";
import { PlayerID } from "../../types";
import { ClientPlayListener } from "../listener/ClientPlayListener";
import { Packet, PacketID } from "../Packet";
import { PacketBuffer } from "../PacketBuffer";

export class PlayerMoveS2CPacket extends Packet<ClientPlayListener> {
  static override get id() {
    return PacketID.PlayerMoveS2C;
  }

  constructor(
    public playerID: PlayerID,
    public x: number,
    public y: number,
    public rotation: number,
    public velX: number,
    public velY: number,
    public velR: number,
    public engineActive: boolean,
  ) {
    super();
  }

  override write(buf: PacketBuffer): void {
    buf.writeString(this.playerID);
    buf.writeFloat(this.x);
    buf.writeFloat(this.y);
    buf.writeFloat(this.rotation);
    buf.writeFloat(this.velX);
    buf.writeFloat(this.velY);
    buf.writeFloat(this.velR);
    buf.writeBoolean(this.engineActive);
  }

  static override read(buf: PacketBuffer): PlayerMoveS2CPacket {
    return new PlayerMoveS2CPacket(
      buf.readString(),
      buf.readFloat(),
      buf.readFloat(),
      buf.readFloat(),
      buf.readFloat(),
      buf.readFloat(),
      buf.readFloat(),
      buf.readBoolean(),
    );
  }

  override apply(listener: ClientPlayListener): void {
    listener.onPlayerMove(this);
  }

  /**
   * Utility function to avoid reusing code on client and server.
   * Updates the player's `x`, `y`, `rotation`, `velX`, `velY`, `velR` and `engineActive` properties to the ones of this packet
   */
  public updatePlayer(player: Player): void {
    player.x = this.x;
    player.y = this.y;
    player.rotation = this.rotation;
    player.velX = this.velX;
    player.velY = this.velY;
    player.velR = this.velR;
    player.engineActive = this.engineActive;
  }

  public static fromPlayer(player: Player): PlayerMoveS2CPacket {
    return new PlayerMoveS2CPacket(
      player.playerID,
      player.x,
      player.y,
      player.rotation,
      player.velX,
      player.velY,
      player.velR,
      player.engineActive,
    );
  }
}
