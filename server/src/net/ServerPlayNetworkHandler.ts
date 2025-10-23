import { ServerPlayListener } from "../../../core/src/net/listener/ServerPlayListener";
import { JoinGameC2SPacket } from "../../../core/src/net/packets/JoinGameC2SPacket";
import { PlayerMoveC2SPacket } from "../../../core/src/net/packets/PlayerMoveC2SPacket";
import { ServerPlayer } from "../entity/ServerPlayer";

export class ServerPlayNetworkHandler extends ServerPlayListener {
  public onJoinGame(packet: JoinGameC2SPacket): void {
    console.log(packet.randomInt);
  }
  public player: ServerPlayer;
  constructor(player: ServerPlayer) {
    super();
    this.player = player;
  }
  public onPlayerMove(packet: PlayerMoveC2SPacket): void {
    console.log("Received packet: " + JSON.stringify(packet));
  }
}
