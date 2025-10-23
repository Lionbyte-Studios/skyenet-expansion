import { ClientPlayListener } from "../../../core/src/net/listener/ClientPlayListener";
import type { DebugS2CPacket } from "../../../core/src/net/packets/DebugS2CPacket";
import type { JoinCallbackS2CPacket } from "../../../core/src/net/packets/JoinCallbackS2CPacket";
import { InGameScreen } from "../graphics/screen/InGameScreen";
import { clientManager } from "../Main";

export class ClientPlayNetworkHandler extends ClientPlayListener {
  public onJoinCallback(packet: JoinCallbackS2CPacket): void {
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
  public onDebug(packet: DebugS2CPacket): void {
    console.log("Debug message from server: " + packet.getMessage());
  }
}
