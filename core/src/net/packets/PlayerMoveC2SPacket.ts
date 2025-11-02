import { FlamesBits, Player } from "../../entity/Player";
import { ServerPlayListener } from "../listener/ServerPlayListener";
import { Packet, PacketID } from "../Packet";
import { PacketBuffer } from "../PacketBuffer";

export class PlayerMoveC2SPacket extends Packet<ServerPlayListener> {
  static override get id() {
    return PacketID.PlayerMoveC2S;
  }

  constructor(
    public x: number,
    public y: number,
    public rotation: number,
    public velX: number,
    public velY: number,
    public velR: number,
    public engineActive: boolean,
    public flames: FlamesBits,
  ) {
    super();
  }

  override write(buf: PacketBuffer): void {
    buf.writeFloat(this.x);
    buf.writeFloat(this.y);
    buf.writeFloat(this.rotation);
    buf.writeFloat(this.velX);
    buf.writeFloat(this.velY);
    buf.writeFloat(this.velR);
    buf.writeBoolean(this.engineActive);
    buf.writeInt(this.flames);
  }

  static override read(buf: PacketBuffer): PlayerMoveC2SPacket {
    return new PlayerMoveC2SPacket(
      buf.readFloat(),
      buf.readFloat(),
      buf.readFloat(),
      buf.readFloat(),
      buf.readFloat(),
      buf.readFloat(),
      buf.readBoolean(),
      buf.readInt(),
    );
  }

  override apply(listener: ServerPlayListener): void {
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
    player.flames = this.flames;
  }
}
