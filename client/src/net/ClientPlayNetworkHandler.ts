import { ClientPlayListener } from "../../../core/src/net/listener/ClientPlayListener";
import type { ChatMessageS2CPacket } from "../../../core/src/net/packets/ChatMessageS2CPacket";
import type { DebugS2CPacket } from "../../../core/src/net/packets/DebugS2CPacket";
import type { JoinCallbackS2CPacket } from "../../../core/src/net/packets/JoinCallbackS2CPacket";
import type { JoinGameS2CPacket } from "../../../core/src/net/packets/JoinGameS2CPacket";
import type { KillEntitiesS2CPacket } from "../../../core/src/net/packets/KillEntitiesS2CPacket";
import type { ModifyEntitiesS2CPacket } from "../../../core/src/net/packets/ModifyEntitiesS2CPacket";
import type { PlayerMoveS2CPacket } from "../../../core/src/net/packets/PlayerMoveS2CPacket";
import type { SpawnEntityS2CPacket } from "../../../core/src/net/packets/SpawnEntityS2CPacket";
import type { IndexSignature } from "../../../core/src/util/Util";
import { ClientPlayer } from "../entity/ClientPlayer";
import { InGameScreen } from "../graphics/screen/InGameScreen";
import { clientManager } from "../Main";

export class ClientPlayNetworkHandler extends ClientPlayListener {
  public override onPlayerJoin(packet: JoinGameS2CPacket): void {
    if (!acceptingInGamePackets()) return;
    clientManager.game.spawnEntity(
      new ClientPlayer(
        packet.playerID,
        packet.entityID,
        packet.x,
        packet.y,
        packet.rotation,
        packet.selectedShip,
        packet.selectedShipEngine,
      ),
    );
    console.log(`New player with ID ${packet.playerID}`);
  }
  public override onPlayerMove(packet: PlayerMoveS2CPacket): void {
    if (!acceptingInGamePackets()) return;
    const player = clientManager.game.findEntities(
      (e) => e instanceof ClientPlayer && e.playerID === packet.playerID,
    )[0];
    packet.updatePlayer(player as ClientPlayer);
    player.onMovementReceived();
  }
  public override onJoinCallback(packet: JoinCallbackS2CPacket): void {
    if (!(clientManager.currentScreen instanceof InGameScreen))
      throw new Error(
        "Received JoinCallback packet while screen is not InGameScreen",
      );
    if (clientManager.currentScreen.state !== "waitingforjoincallbackdata")
      throw new Error(
        "Received JoinCallback packet while screen was not waiting for it",
      );
    console.log("Received JoinCallback packet: " + JSON.stringify(packet));
    clientManager.currentScreen.joinCallback(packet);
  }
  public override onDebug(packet: DebugS2CPacket): void {
    console.log("Debug message from server: " + packet.getMessage());
  }
  public override onSpawnEntity(packet: SpawnEntityS2CPacket): void {
    if (!acceptingInGamePackets()) return;
    clientManager.game.spawnEntity(packet.entity);
  }
  public override onKillEntities(packet: KillEntitiesS2CPacket): void {
    if (!acceptingInGamePackets()) return;
    packet.entityIDs.forEach((id) => {
      const entityKilled = clientManager.game.world.killEntity(id);
      if (!entityKilled) {
        console.warn(`Entity with id ${id} not found.`);
      }
    });
  }
  public override onModifyEntities(packet: ModifyEntitiesS2CPacket): void {
    if (!acceptingInGamePackets()) return;
    packet.entityModifications.forEach((modification) => {
      clientManager.game.modifyEntityData(
        (entity) => entity.entityID === modification.entityID,
        modification.modifications as IndexSignature<
          typeof modification.modifications
        >,
      );
    });
  }

  public override onChatMessage(packet: ChatMessageS2CPacket): void {
    if (!acceptingInGamePackets()) return;
    (clientManager.currentScreen as InGameScreen).addChatMessage(
      packet.message,
    );
  }
}

function acceptingInGamePackets(): boolean {
  return (
    clientManager.currentScreen instanceof InGameScreen &&
    clientManager.currentScreen.state === "gamerunning"
  );
}
