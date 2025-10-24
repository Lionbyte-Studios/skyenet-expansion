import { ClientPlayListener } from "../../../core/src/net/listener/ClientPlayListener";
import type { DebugS2CPacket } from "../../../core/src/net/packets/DebugS2CPacket";
import type { JoinCallbackS2CPacket } from "../../../core/src/net/packets/JoinCallbackS2CPacket";
import type { JoinGameS2CPacket } from "../../../core/src/net/packets/JoinGameS2CPacket";
import type { PlayerMoveS2CPacket } from "../../../core/src/net/packets/PlayerMoveS2CPacket";
import type { SpawnEntityS2CPacket } from "../../../core/src/net/packets/SpawnEntityS2CPacket";
import { ClientPlayer } from "../entity/ClientPlayer";
import { InGameScreen } from "../graphics/screen/InGameScreen";
import { clientManager } from "../Main";

export class ClientPlayNetworkHandler extends ClientPlayListener {
  public override onPlayerJoin(packet: JoinGameS2CPacket): void {
    if (clientManager.game === undefined) return;
    clientManager.game.players.push(
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
    if (clientManager.game === undefined) return;
    const index = clientManager.game.players.findIndex(
      (player) => player.playerID === packet.playerID,
    );
    if (index === -1) return;
    packet.updatePlayer(clientManager.game.players[index]);
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
    if (!(clientManager.currentScreen instanceof InGameScreen)) return;
    if (clientManager.currentScreen.state !== "gamerunning") return;
    clientManager.game.entities.push(packet.entity);
  }
}
