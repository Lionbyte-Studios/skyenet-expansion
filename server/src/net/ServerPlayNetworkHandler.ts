import { ServerPlayListener } from "../../../core/src/net/listener/ServerPlayListener";
import { PlayerMoveC2SPacket } from "../../../core/src/net/packets/raw/PlayerMoveC2SPacket";
import { ServerPlayer } from "../entity/ServerPlayer";

export class ServerPlayNetworkHandler extends ServerPlayListener {
  public player: ServerPlayer;
  constructor(player: ServerPlayer) {
    super();
    this.player = player;
  }
  public onPlayerMove(packet: PlayerMoveC2SPacket): void {
    console.log("Received packet: " + JSON.stringify(packet));
  }
}
