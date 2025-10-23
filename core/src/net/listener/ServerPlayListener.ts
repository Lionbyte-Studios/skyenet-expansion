import { PlayerMoveC2SPacket } from "../packets/raw/PlayerMoveC2SPacket";
import { PlayListener } from "./PlayListener";

export abstract class ServerPlayListener extends PlayListener {
  public abstract onPlayerMove(packet: PlayerMoveC2SPacket): void;
}
