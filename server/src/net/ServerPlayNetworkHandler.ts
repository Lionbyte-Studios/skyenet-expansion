import { ServerPlayListener } from "../../../core/src/net/listener/ServerPlayListener";
import { JoinCallbackS2CPacket } from "../../../core/src/net/packets/JoinCallbackS2CPacket";
import { JoinGameC2SPacket } from "../../../core/src/net/packets/JoinGameC2SPacket";
import { PlayerMoveC2SPacket } from "../../../core/src/net/packets/PlayerMoveC2SPacket";
import { ServerPlayer } from "../entity/ServerPlayer";
import { serverMgr } from "../Main";
import { ServerConnection } from "./ServerConnection";

export class ServerPlayNetworkHandler extends ServerPlayListener {
  private packetSender: ServerConnection["sendPacket"];

  public onJoinGame(packet: JoinGameC2SPacket): void {
    const player = serverMgr.game.generatePlayer(
      packet.selectedShip,
      packet.selectedShipEngine,
    );
    serverMgr.game.addPlayer(player);
    this.packetSender(
      new JoinCallbackS2CPacket(
        player.playerID,
        player.entityID,
        serverMgr.game.gameID,
        serverMgr.game.players,
        serverMgr.game.entities,
      ),
    );
  }
  public player: ServerPlayer;
  constructor(
    player: ServerPlayer,
    packetSender: ServerConnection["sendPacket"],
  ) {
    super();
    this.player = player;
    this.packetSender = packetSender;
  }
  public onPlayerMove(packet: PlayerMoveC2SPacket): void {
    console.log("Received packet: " + JSON.stringify(packet));
  }
}
