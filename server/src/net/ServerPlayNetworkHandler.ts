import { ServerPlayListener } from "../../../core/src/net/listener/ServerPlayListener";
import { JoinCallbackS2CPacket } from "../../../core/src/net/packets/JoinCallbackS2CPacket";
import { JoinGameC2SPacket } from "../../../core/src/net/packets/JoinGameC2SPacket";
import { JoinGameS2CPacket } from "../../../core/src/net/packets/JoinGameS2CPacket";
import { PlayerMoveC2SPacket } from "../../../core/src/net/packets/PlayerMoveC2SPacket";
import { PlayerMoveS2CPacket } from "../../../core/src/net/packets/PlayerMoveS2CPacket";
import { ServerPlayer } from "../entity/ServerPlayer";
import { serverMgr } from "../Main";
import { ServerConnection } from "./ServerConnection";

export class ServerPlayNetworkHandler extends ServerPlayListener {
  private packetSender: ServerConnection["sendPacket"];
  public player?: ServerPlayer;
  private socket_id: string;

  public onJoinGame(packet: JoinGameC2SPacket): void {
    const player = serverMgr.game.generatePlayer(
      packet.selectedShip,
      packet.selectedShipEngine,
    );
    serverMgr.game.addPlayer(player);
    this.player = player;
    this.packetSender(
      new JoinCallbackS2CPacket(
        player.playerID,
        player.entityID,
        serverMgr.game.gameID,
        serverMgr.game.players,
        serverMgr.game.entities,
      ),
    );
    serverMgr.wsMgr.broadcastPacket(
      new JoinGameS2CPacket(
        player.playerID,
        player.entityID,
        player.x,
        player.y,
        player.rotation,
        player.shipSprite,
        player.shipEngineSprite,
      ),
      [this.socket_id],
    );
  }
  constructor(packetSender: ServerConnection["sendPacket"], socket_id: string) {
    super();
    this.player = undefined;
    this.packetSender = packetSender;
    this.socket_id = socket_id;
  }
  public onPlayerMove(packet: PlayerMoveC2SPacket): void {
    if (this.player === undefined) return;
    packet.updatePlayer(this.player);
    serverMgr.wsMgr.broadcastPacket(
      PlayerMoveS2CPacket.fromPlayer(this.player),
      [this.socket_id],
    );
  }
}
