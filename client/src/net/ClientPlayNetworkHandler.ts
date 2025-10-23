import { ClientPlayListener } from "../../../core/src/net/listener/ClientPlayListener";
import type { DebugS2CPacket } from "../../../core/src/net/packets/DebugS2CPacket";
import { JoinGameC2SPacket } from "../../../core/src/net/packets/JoinGameC2SPacket";
import { clientManager } from "../Main";

export class ClientPlayNetworkHandler extends ClientPlayListener {
  public onDebug(packet: DebugS2CPacket): void {
    console.log("Debug message from server: " + packet.getMessage());
    clientManager.webSocketManager.connection.sendPacket(
      new JoinGameC2SPacket(12345),
    );
  }
}
