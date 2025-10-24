import { PacketRegistry } from "../PacketRegistry";
import { DebugS2CPacket } from "../packets/DebugS2CPacket";
import { JoinCallbackS2CPacket } from "../packets/JoinCallbackS2CPacket";
import { JoinGameS2CPacket } from "../packets/JoinGameS2CPacket";
import { KillEntitiesS2CPacket } from "../packets/KillEntitiesS2CPacket";
import { PlayerMoveS2CPacket } from "../packets/PlayerMoveS2CPacket";
import { SpawnEntityS2CPacket } from "../packets/SpawnEntityS2CPacket";
import { PlayListener } from "./PlayListener";

export abstract class ClientPlayListener extends PlayListener {
  public abstract onDebug(packet: DebugS2CPacket): void;
  public abstract onJoinCallback(packet: JoinCallbackS2CPacket): void;
  public abstract onPlayerMove(packet: PlayerMoveS2CPacket): void;
  public abstract onPlayerJoin(packet: JoinGameS2CPacket): void;
  public abstract onSpawnEntity(packet: SpawnEntityS2CPacket): void;
  public abstract onKillEntities(packet: KillEntitiesS2CPacket): void;

  public _registerPackets(registry: PacketRegistry<ClientPlayListener>) {
    registry.register(DebugS2CPacket.id, DebugS2CPacket);
    registry.register(JoinCallbackS2CPacket.id, JoinCallbackS2CPacket);
    registry.register(PlayerMoveS2CPacket.id, PlayerMoveS2CPacket);
    registry.register(JoinGameS2CPacket.id, JoinGameS2CPacket);
    registry.register(SpawnEntityS2CPacket.id, SpawnEntityS2CPacket);
    registry.register(KillEntitiesS2CPacket.id, KillEntitiesS2CPacket);
  }
}
