import { ClientPlayListener } from "../../../core/src/net/listener/ClientPlayListener";
import type { DebugS2CPacket } from "../../../core/src/net/packets/raw/DebugS2CPacket";

export class ClientPlayNetworkHandler extends ClientPlayListener {
  public onDebug(packet: DebugS2CPacket): void {
    console.log("Debug message from server: " + packet.getMessage());
  }
}
