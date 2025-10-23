import { DebugS2CPacket } from "../packets/DebugS2CPacket";
import { JoinCallbackS2CPacket } from "../packets/JoinCallbackS2CPacket";
import { PlayListener } from "./PlayListener";

export abstract class ClientPlayListener extends PlayListener {
  public abstract onDebug(packet: DebugS2CPacket): void;
  public abstract onJoinCallback(packet: JoinCallbackS2CPacket): void;
}
