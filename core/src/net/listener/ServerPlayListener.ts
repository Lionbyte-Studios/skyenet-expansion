import { PacketRegistry } from "../PacketRegistry";
import { BulletShootC2SPacket } from "../packets/BulletShootC2SPacket";
import { JoinGameC2SPacket } from "../packets/JoinGameC2SPacket";
import { PlayerMoveC2SPacket } from "../packets/PlayerMoveC2SPacket";
import { PlayListener } from "./PlayListener";

export abstract class ServerPlayListener extends PlayListener {
  public abstract onPlayerMove(packet: PlayerMoveC2SPacket): void;
  public abstract onJoinGame(packet: JoinGameC2SPacket): void;
  public abstract onBulletShoot(packet: BulletShootC2SPacket): void;
  public _registerPackets(registry: PacketRegistry<ServerPlayListener>) {
    registry.register(PlayerMoveC2SPacket.id, PlayerMoveC2SPacket);
    registry.register(JoinGameC2SPacket.id, JoinGameC2SPacket);
    registry.register(BulletShootC2SPacket.id, BulletShootC2SPacket);
  }
}
