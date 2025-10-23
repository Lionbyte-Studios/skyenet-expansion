import { DebugS2CPacket } from "../packets/DebugS2CPacket";
import { PlayListener } from "./PlayListener";

export abstract class ClientPlayListener extends PlayListener {
  public abstract onDebug(packet: DebugS2CPacket): void;
}
